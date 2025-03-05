"use client";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";
import {
  ComboboxEstablishment,
  LoadingSpinnerModal,
} from "@/components/template";
import { TitlePage } from "@/components/TitlePage";
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  useToast,
} from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "@/utils";
import { formatarData } from "@/utils/formatarData";
import { ErrorHandlerAdapter } from "@/presentation/adapters";

const FormSchemaPrestacao = z.object({
  estabelecimento: z.string({
    required_error: "Escolha um estabelecimento",
  }),
  ciclosDePrestacao: z.string({
    required_error: "Escolha um ciclo de prestacao",
  }),
  data_pagamento: z.date({
    required_error: "Escolha um dia",
  }),
  tipo_pagamento: z.string({ required_error: "Adicione um tipo de pagamento" }),
  valor: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().min(0.01).max(999999999999),
  ),
  file: (typeof window === "undefined" ? z.any() : z.instanceof(FileList))
    .refine((file) => file?.length > 0, "Informe um arquivo")
    .optional(),
});

type TFormSchemaPrestacao = z.infer<typeof FormSchemaPrestacao>;

export default function Prestacao() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm<TFormSchemaPrestacao>({
    resolver: zodResolver(FormSchemaPrestacao),
    mode: "onChange",
  });
  const { isSubmitting } = form.formState;
  const estabelecimentos = useFetch<
    {
      id: number;
      name: string;
    }[]
  >("/api/v1/management/companies");
  const estabelecimentosFormatados = useMemo(() => {
    return (
      estabelecimentos.data?.map((estabelecimento) => ({
        ...estabelecimento,
        name: estabelecimento.name,
      })) || []
    );
  }, [estabelecimentos.data]);

  const [prestacaoData, setPrestacaoData] = useState<{
    estabelecimentos: {
      id: number;
      name: string;
    }[];
    estabelecimentoSelecionado: string;
    ciclosDePrestacao:
      | {
          id: number;
          reference_date: string;
          status: string;
          createdAt: Date;
          updateAt: Date;
          establishmentId: number;
        }[]
      | undefined;
  }>({
    estabelecimentos: [],
    estabelecimentoSelecionado: "",
    ciclosDePrestacao: undefined,
  });

  useEffect(() => {
    if (!prestacaoData.estabelecimentoSelecionado) return;
    const fetchData = async () => {
      try {
        const httpClient = new FetchHttpClient();
        const response = await httpClient.get<
          {
            id: number;
            reference_date: string;
            status: string;
            createdAt: Date;
            updateAt: Date;
            establishmentId: number;
          }[]
        >(
          `/api/v1/management/ciclo?estabelecimento=${prestacaoData.estabelecimentoSelecionado}`,
        );
        setPrestacaoData((prev) => ({
          ...prev,
          ciclosDePrestacao: response.data,
        }));
      } catch (error) {
        const errorAdapter = new ErrorHandlerAdapter();
        return errorAdapter.handle(error);
      }
    };

    fetchData();
  }, [prestacaoData.estabelecimentoSelecionado]);

  async function handleFormPrestacao(data: FieldValues) {
    const formData = new FormData();
    const ciclo = JSON.parse(data.ciclosDePrestacao).id.toString();
    const file = data.file ? data.file[0] : undefined;
    formData.append("file", file);
    const estabelecimento = JSON.parse(data.estabelecimento).id.toString();
    formData.append("date", data.data_pagamento);
    formData.append("user", session?.user.username as string);
    formData.append("estabelecimentoId", estabelecimento);
    formData.append("tipo_pagamento", data.tipo_pagamento);
    formData.append("valor", data.valor);
    formData.append("ciclo", ciclo);
    formData.append("data_pagamento", data.data_pagamento);

    try {
      const fetch = new FetchHttpClient();
      const response: {
        data: { status: number; message: string } | undefined;
        status: number;
      } = await fetch.post("/api/v1/entering/prestacao/criar", formData);
      if (response.data?.status === 201) {
        toast({
          description: (
            <code className="text-slate-200">{response.data?.message}</code>
          ),
          variant: "success",
        });
        return;
      }
      toast({
        description: (
          <pre className="rounded-md p-4">
            <code className="text-slate-200 text-wrap">
              Verifique se você preencheu as informações de maneira correta
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } catch (error) {
      const errorAdapter = new ErrorHandlerAdapter();
      return errorAdapter.handle(error);
    } finally {
      form.resetField("ciclosDePrestacao");
      form.resetField("file");
      form.resetField("valor");
    }
  }

  return (
    <main className="grid gap-2 ">
      <TitlePage title="Conclusão de ciclo" />
      <Form {...form}>
        <form
          className={`grid gap-3 place-items-start mt-6 ${isSubmitting ? "cursor-progress" : ""} `}
          encType="multipart/form-data"
          onSubmit={form.handleSubmit(handleFormPrestacao)}
        >
          <FormField
            control={form.control}
            name="estabelecimento"
            render={({ field }) => {
              return (
                <FormItem className="grid">
                  <FormLabel className="decoration-foreground">
                    Selecione um estabelecimento
                  </FormLabel>
                  <ComboboxEstablishment
                    onValueChange={(value) => {
                      field.onChange(value);

                      console.log(Object.entries(JSON.stringify(value)));
                      // setPrestacaoData((prev) => ({
                      //   ...prev,
                      //   estabelecimentoSelecionado:
                      //     JSON.parse(value).id.toString(),
                      // }));
                    }}
                    establishments={estabelecimentosFormatados}
                  />

                  <FormMessage className="text-xs" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="ciclosDePrestacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="decoration-foreground">
                  Selecione a prestação
                </FormLabel>
                <Select
                  onValueChange={(empresa) => {
                    field.onChange(empresa);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[240px]">
                      <Button
                        placeholder="Escolha um Ciclo de Prestação"
                        style={{ all: "unset" }}
                        asChild
                      >
                        <span>
                          {field.value
                            ? JSON.parse(field.value).reference_date
                            : "Selecione um estabelecimento para ver os ciclos"}
                        </span>
                      </Button>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {prestacaoData.ciclosDePrestacao &&
                      prestacaoData.ciclosDePrestacao.length > 0
                        ? prestacaoData.ciclosDePrestacao.map((item) => {
                            const { finalDoCiclo, inicioDoCiclo } =
                              obterInicioEFimDoCiclo(
                                new Date(formatarData(item.reference_date)),
                              );

                            return (
                              <SelectItem
                                key={item.id}
                                value={JSON.stringify(item)}
                              >
                                <div className="grid justify-between">
                                  <time dateTime={inicioDoCiclo.toISOString()}>
                                    {inicioDoCiclo.toLocaleDateString()}
                                  </time>
                                  <time dateTime={finalDoCiclo.toISOString()}>
                                    {finalDoCiclo.toLocaleDateString()}
                                  </time>
                                </div>
                              </SelectItem>
                            );
                          })
                        : "Não há ciclos de prestação"}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_pagamento"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel>Data de pagamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value)
                      ) : (
                        <span>Escolha uma dia</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(data) => {
                        try {
                          field.onChange(data);
                        } catch (error) {
                          console.error("Calendar", error);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecione o arquivo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.html, .htm"
                    onChange={(file) => {
                      field.onChange(file.target.files);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_pagamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Pagamento</FormLabel>

                <Select onValueChange={(tipo) => field.onChange(tipo)}>
                  <SelectTrigger className="w-[240px]">
                    <Button
                      placeholder="Escolha um estabelecimento"
                      style={{ all: "unset" }}
                      asChild
                    >
                      <span>
                        {field.value
                          ? field.value
                          : "Escolha o tipo de pagamento"}
                      </span>
                    </Button>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <Input
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  type="number"
                  min={0.01}
                  max={999999999999}
                  step={0.01}
                />

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            variant={isSubmitting ? "destructive" : "default"}
            type="submit"
          >
            Lançar
          </Button>
          <LoadingSpinnerModal open={isSubmitting} title={"Lançando"} />
        </form>
      </Form>
    </main>
  );
}
