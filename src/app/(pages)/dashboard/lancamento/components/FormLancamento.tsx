"use client";
import { useContext, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  useToast,
  ErrorMessageInput,
} from "@/components/ui";

import { CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "@/utils";

import { TEstabelecimento } from "@/types/estabelecimento";
import { LancamentoContext } from "@/context/lancamentoContext";
import { ComboboxEstablishment } from "@/components/template";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { LancamentosTable } from "@/components/template/table-lancamentos/columns";
import { useFetch } from "@/hooks/useFetch";
import { Empresa, Estabelecimento } from "@prisma/client";

const FormSchema = z.object({
  data_inicial: z
    .date({
      required_error: "Escolha um dia",
    })
    .optional(),
  data_final: z
    .date({
      required_error: "Escolha um dia",
    })
    .optional(),
  tipo: z.string({}).optional(),
  forma_pagamento: z.string({}).optional(),
  estabelecimento: z.string({}).optional(),
  empresaId: z.string({}).optional(),
});

type TFormSchema = z.infer<typeof FormSchema>;
export const FormLancamento = () => {
  const { toast } = useToast();
  const [inputDate, setInputDate] = useState<{
    initial?: Date;
    release?: Date;
  }>();
  const { setLancamento } = useContext(LancamentoContext);

  const { handleSubmit, formState, reset, control } = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
  });
  const obterEstabelecimentos = useFetch<Partial<Estabelecimento>[]>(
    "/api/v1/management/establishments",
  ).data;
  const obterEmpresas = useFetch<{ empresas: Partial<Empresa>[] }>(
    "/api/v1/management/empresa/obterTodas",
  );
  const empresas = useMemo(() => {
    if (obterEmpresas.data && obterEmpresas.data.empresas.length > 0) {
      return obterEmpresas.data.empresas.map((empresa) => ({
        ...empresa,
        name: empresa.name,
      }));
    }
    return [];
  }, [obterEmpresas.data]);

  const estabelecimentos = useMemo(() => {
    if (obterEstabelecimentos && obterEstabelecimentos.length > 0) {
      return obterEstabelecimentos;
    }
    return [];
  }, [obterEstabelecimentos]);

  async function formSubmit(data: TFormSchema) {
    try {
      if (
        data.data_final === undefined &&
        data.data_inicial === undefined &&
        data.estabelecimento === undefined &&
        data.forma_pagamento === undefined &&
        data.tipo === undefined &&
        data.empresaId === undefined
      ) {
        toast({
          title: "Error",
          description: "Nenhum campo foi preenchido",
          variant: "destructive",
        });
        return;
      }
      const fetch = new FetchHttpClient();

      const { data: response } = await fetch.post<LancamentosTable[]>(
        "/api/v1/entering/read",
        data,
      );
      setLancamento(response || []);

      toast({
        title: "Sucesso",
        description: "Busca realizada com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo deu errado",
        variant: "destructive",
      });
      console.error("formSubmit", error);
    }
  }
  const { isSubmitting, errors } = formState;
  return (
    <form
      className="w-full grid mt-8 gap-2 justify-between "
      onSubmit={handleSubmit(formSubmit)}
    >
      <div className="grid grid-cols-4 justify-between gap-2 max-xl:grid-cols-3; max-lg:grid-cols-2 place-items-center; max-sm-[530px]:grid-cols-1 place-items-center w-full; ">
        <Controller
          control={control}
          name="data_inicial"
          render={({ field: { value, onChange } }) => {
            return (
              <div className="grid gap-2">
                <div>
                  <label>Inicio da Semana</label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] sm:w-full; pl-3 text-left font-normal max-sm:w-full;",
                        !value && "text-muted-foreground",
                      )}
                    >
                      {inputDate?.initial ? (
                        format(inputDate?.initial)
                      ) : (
                        <span>Escolha uma dia</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={value}
                      onSelect={(data) => {
                        setInputDate({
                          release: undefined,
                          initial: data,
                        });
                        reset({
                          data_final: undefined,
                          data_inicial: data,
                        });
                        onChange(data);
                      }}
                      disabled={(date: Date) =>
                        date > new Date() ||
                        date < new Date("1900-01-01") ||
                        date.getDay() !== 1
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors["data_inicial"] && (
                  <ErrorMessageInput error={errors} name={"data_inicial"} />
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="data_final"
          render={({ field: { value, onChange } }) => {
            return (
              <div className="grid gap-2">
                <div>
                  <label>Data do Lançamento</label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal max-sm:w-full;",
                        !value && "text-muted-foreground",
                      )}
                    >
                      {inputDate?.release ? (
                        format(inputDate?.release)
                      ) : (
                        <span>Escolha uma dia</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={inputDate?.release}
                      onSelect={(select) => {
                        onChange(inputDate?.release);
                        setInputDate({
                          initial: undefined,
                          release: select,
                        });
                        reset({
                          data_inicial: undefined,
                          data_final: select,
                        });
                      }}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors["data_final"] && (
                  <ErrorMessageInput error={errors} name={"data_final"} />
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <div className="grid gap-2">
              <label>Tipo de lançamento</label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[240px] max-sm:w-full;">
                  <SelectValue placeholder="Lançamento" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="sangria">Sangria</SelectItem>
                    <SelectItem value="deposito">Deposito</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors["tipo"] && (
                <ErrorMessageInput error={errors} name={"tipo"} />
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="forma_pagamento"
          render={({ field }) => (
            <div className="grid gap-2">
              <label>Escolha uma forma de pagamento</label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[240px] max-sm:w-full;">
                  <SelectValue placeholder="Pagamento" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">Pix</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors["forma_pagamento"] && (
                <ErrorMessageInput error={errors} name={"forma_pagamento"} />
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="estabelecimento"
          render={({ field }) => (
            <>
              <ComboboxEstablishment
                establishments={estabelecimentos as TEstabelecimento[]}
                onValueChange={(value) => {
                  if (value.length > 0) {
                    field.onChange(value);
                  }
                }}
              />
              {errors["estabelecimento"] && (
                <ErrorMessageInput error={errors} name={"estabelecimento"} />
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="empresaId"
          render={({ field }) => (
            <>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[240px] max-sm:w-full;">
                  <SelectValue placeholder="empresa" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {empresas.length > 0 &&
                      empresas.map((empresa) => (
                        <SelectItem
                          key={empresa.id}
                          value={empresa.id?.toString() as string}
                        >
                          {empresa.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors["estabelecimento"] && (
                <ErrorMessageInput error={errors} name={"estabelecimento"} />
              )}
            </>
          )}
        />

        <Button
          className="flex gap-2 w-[240px] max-sm:w-full;"
          type="submit"
          disabled={isSubmitting}
          title="Procurar"
          variant={"outline"}
        >
          <Search size={14} />
          <span>Procurar</span>
        </Button>
      </div>
    </form>
  );
};
