"use client";
import {
  Button,
  ErrorMessageInput,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  useToast,
} from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { tornarPrimeiraLetraMaiuscula } from "@/utils";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Empresa } from "@prisma/client";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Escolha uma nome",
    })
    .regex(/^\d{4} - [A-Za-z]{3,}.*$/, {
      message:
        "O formato deve ser '0000 - Nome' com pelo menos 3 letras após o hífen",
    }),
  empresa: z.string({
    required_error: "Escolha um site",
  }),
});

const escolherRota = (rota: string) => {
  switch (rota) {
    case "localidade":
      return "locations";
    case "secao":
      return "sections";

    default:
      return "routes";
  }
};

type TFormSchema = z.infer<typeof formSchema>;

export default function Page({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const [selectOptions, setSelectOptions] = useState<any>();
  const { handleSubmit, formState, control } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  const dados = useFetch<{ empresas: Partial<Empresa>[] }>(
    "/api/v1/management/empresa/obterTodas",
  );

  useEffect(() => {
    setSelectOptions(dados.data?.empresas);
  }, [dados]);
  useEffect(() => {}, [selectOptions]);

  const onSubmit = async (data: FieldValues) => {
    try {
      const fetch = new FetchHttpClient();
      await fetch.post(
        `/api/v1/management/${escolherRota(params.slug)}/criar`,
        {
          name: data.name,
          empresa: data.empresa,
        },
      );
      toast({
        title: `${tornarPrimeiraLetraMaiuscula(params.slug)} criada com sucesso!`,
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `Algo não está certo, tente novamente.`,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold">
        Crie a {tornarPrimeiraLetraMaiuscula(params.slug)}
      </h2>
      <p className="text-sm text-muted-foreground">
        Preencha o campo a baixo como no exemplo
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid mt-6 max-w-60 ">
        <div>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <>
                <Label>Nome</Label>
                <Input
                  id="name"
                  onChange={field.onChange}
                  placeholder={`0000 - Nome da ${tornarPrimeiraLetraMaiuscula(params.slug)}`}
                />
              </>
            )}
          />
          <ErrorMessageInput error={formState.errors} name={"name"} />
        </div>
        <div>
          <Controller
            control={control}
            name="empresa"
            render={({ field }) => (
              <>
                <Select
                  onValueChange={(site) => {
                    field.onChange(site);
                  }}
                >
                  <SelectTrigger className="w-[240px]">
                    <Button
                      placeholder="Escolha uma empresa"
                      style={{ all: "unset" }}
                      asChild
                    >
                      <span>
                        {field.value ? field.value : "Escolha um empresa"}
                      </span>
                    </Button>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {selectOptions && selectOptions.length > 0 ? (
                        selectOptions.map((item: Partial<Empresa>) => (
                          <SelectItem key={item.name} value={item.name || ""}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ErrorMessageInput error={formState.errors} name={"empresa"} />
              </>
            )}
          />
        </div>
        <Button type="submit" disabled={formState.isSubmitting}>
          Criar
        </Button>
      </form>
    </div>
  );
}
