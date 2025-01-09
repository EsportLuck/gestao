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
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Empresa, Localidade, Secao } from "@prisma/client";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Escolha uma nome",
    })
    .regex(/^\d{6} - [A-Za-z]{3,}.*$/, {
      message:
        "O formato deve ser '000000 - Nome' com pelo menos 3 letras após o hífen",
    }),
  empresa: z.string({
    required_error: "Escolha uma empresa",
  }),
  localidade: z.string({
    required_error: "Escolha uma Localidade",
  }),
  secao: z.string({
    required_error: "Escolha uma Seção",
  }),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const { toast } = useToast();

  const { handleSubmit, formState, control } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  const dados = useFetch<{ empresas: Partial<Empresa>[] }>(
    "/api/v1/management/empresa/obterTodas",
  );
  const dadosLocalidades = useFetch<Partial<Localidade>[]>(
    "/api/v1/management/locations",
  );
  const dadosSecoes = useFetch<Partial<Secao>[]>("/api/v1/management/sections");
  const selectOptions = useMemo(
    () => ({
      empresas: dados.data?.empresas,
      localidades: dadosLocalidades.data,
      secoes: dadosSecoes.data,
    }),
    [dados, dadosLocalidades, dadosSecoes],
  );

  const onSubmit = async (data: FieldValues) => {
    try {
      const fetch = new FetchHttpClient();
      const response = await fetch.post(
        `/api/v1/management/establishments/create`,
        {
          name: data.name,
          empresa: data.empresa,
          localidade: data.localidade,
          secao: data.secao,
        },
      );

      toast({
        title: ` Estabeleciemnto criada com sucesso!`,
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
      <h2 className="text-2xl font-bold">Crie um Estabelecimento</h2>
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
                  placeholder={`000000 - Nome do Estabelecimento`}
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
                      {selectOptions.empresas &&
                      selectOptions.empresas?.length > 0 ? (
                        selectOptions.empresas.map((item: Partial<Empresa>) => (
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
        <div>
          <Controller
            control={control}
            name="localidade"
            render={({ field }) => (
              <>
                <Select
                  onValueChange={(site) => {
                    field.onChange(site);
                  }}
                >
                  <SelectTrigger className="w-[240px]">
                    <Button
                      placeholder="Escolha uma localidade"
                      style={{ all: "unset" }}
                      asChild
                    >
                      <span>
                        {field.value ? field.value : "Escolha um localidade"}
                      </span>
                    </Button>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {selectOptions.localidades &&
                      selectOptions.localidades.length > 0 ? (
                        selectOptions.localidades.map(
                          (item: Partial<Empresa>) => (
                            <SelectItem key={item.name} value={item.name || ""}>
                              {item.name}
                            </SelectItem>
                          ),
                        )
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
        <div>
          <Controller
            control={control}
            name="secao"
            render={({ field }) => (
              <>
                <Select
                  onValueChange={(site) => {
                    field.onChange(site);
                  }}
                >
                  <SelectTrigger className="w-[240px]">
                    <Button
                      placeholder="Escolha uma seção"
                      style={{ all: "unset" }}
                      asChild
                    >
                      <span>
                        {field.value ? field.value : "Escolha um seção"}
                      </span>
                    </Button>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {selectOptions.secoes &&
                      selectOptions.secoes.length > 0 ? (
                        selectOptions.secoes.map((item: Partial<Empresa>) => (
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
