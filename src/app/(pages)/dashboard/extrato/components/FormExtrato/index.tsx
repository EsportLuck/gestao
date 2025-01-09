"use client";
import React, { useEffect, useMemo, useState } from "react";

import { FC } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Calendar,
  ErrorMessageInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { format, numberFormater } from "@/utils";
import { CalendarIcon, Search } from "lucide-react";
import {
  DataTableEstabelecimentos,
  TotalValueTable,
} from "@/components/template";
import { useFetch } from "@/hooks/useFetch";
import { Estabelecimento, Localidade, Secao, Supervisor } from "@prisma/client";
import { EstabelecimentosExtrato } from "@/components/template/estabelecimentos-report-table/columns";
import { useSession } from "next-auth/react";

interface ISupervisorCompleto extends Supervisor {
  Localidade?: {
    id: string;
    name: string;
  }[];
  Secao?: {
    id: string;
    name: string;
  }[];
}

const formSchema = z.object({
  dataInicial: z.date({
    required_error: "Escolha uma data",
  }),
  dataFinal: z.date({
    required_error: "Escolha uma data",
  }),
  localidade: z.string().optional(),
  secao: z.string().optional(),
  rota: z.string().optional(),
  supervisor: z.string().optional(),
  estabelecimento: z.string().optional(),
  empresa: z.string().optional(),
});
type TFormExtrato = {};

type TFormSchema = z.infer<typeof formSchema>;

export const FormExtrato: FC<TFormExtrato> = ({}) => {
  const { data: infoUser } = useSession();
  const { handleSubmit, formState, control } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, errors } = formState;
  const [dateFilter, setDateFilter] = useState<{
    date_inicial: undefined | Date;
    date_final: undefined | Date;
  }>({
    date_inicial: undefined,
    date_final: undefined,
  });
  const [dataForForm, setDataForForm] = useState<{
    localidade: Partial<Localidade>[] | null;
    secao: Partial<Secao>[] | null;
    rota: undefined | Array<any>;
    supervisores: Partial<ISupervisorCompleto>[] | null;
    estabelecimento: Partial<Estabelecimento>[] | null;
    empresa: Array<"Arena" | "Sportnet" | "Bingo"> | null;
  }>({
    localidade: null,
    secao: null,
    rota: undefined,
    supervisores: null,
    estabelecimento: null,
    empresa: ["Arena", "Sportnet", "Bingo"],
  });
  const [dataExtrato, setDataExtrato] = useState<
    EstabelecimentosExtrato[] | []
  >([]);
  const [totalValue, setTotalValue] = useState<
    | {
        label: string;
        value: string | number;
      }[]
    | undefined
  >(undefined);

  const { data: localidadesData } = useFetch<Partial<Localidade>[]>(
    "/api/v1/management/locations",
  );
  const { data: secaoData } = useFetch<Partial<Secao>[]>(
    "/api/v1/management/sections",
  );
  const supervisores = useFetch<ISupervisorCompleto[]>(
    "/api/v1/management/supervisores",
  ).data;

  const estabelecimentos = useFetch<Partial<Estabelecimento>[]>(
    "/api/v1/management/establishments",
  ).data;

  const localidades = useMemo(() => {
    const nomeSupervisor = infoUser?.user.username || "";
    const supervisor = supervisores?.find(
      (item) => item.name === nomeSupervisor,
    );

    if (supervisor?.Localidade) {
      return (
        localidadesData?.filter((item) =>
          supervisor.Localidade?.some(
            (localidade) => localidade.name === item.name,
          ),
        ) || []
      );
    }
    return localidadesData || [];
  }, [infoUser?.user.username, supervisores, localidadesData]);

  const secao = useMemo(() => {
    const nomeSupervisor = infoUser?.user.username || "";
    const supervisor = supervisores?.find(
      (item) => item.name === nomeSupervisor,
    );

    if (supervisor?.Secao) {
      return (
        secaoData?.filter((item) =>
          supervisor.Secao?.some((secao) => secao.name === item.name),
        ) || []
      );
    }
    return secaoData || [];
  }, [infoUser?.user.username, supervisores, secaoData]);

  useEffect(() => {
    setDataForForm({
      ...dataForForm,
      estabelecimento: estabelecimentos,
      localidade: localidades,
      secao: secao,
      supervisores,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estabelecimentos]);

  async function handleSubmitExtrato(event: FieldValues) {
    try {
      const queryParams = new URLSearchParams({
        dataInicial: String(event.dataInicial || ""),
        dataFinal: String(event.dataFinal || ""),
        localidade: String(event.localidade || ""),
        secao: String(event.secao || ""),
        rota: String(event.rota || ""),
        supervisor: String(event.supervisor || ""),
        estabelecimento: String(event.estabelecimento || ""),
        role: String(infoUser?.user.role || ""),
        username: String(infoUser?.user.username || ""),
        site: String(infoUser?.user.site || ""),
        empresa: String(event.empresa || ""),
      });

      const response = await fetch(
        `/api/v1/extract?${queryParams.toString()}`,
        {
          method: "GET",
          cache: "default",
        },
      );
      const data = await response.json();

      const vendas: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) => total + item.vendas,
          0,
        ),
      );
      const liquido: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.líquido,
          0,
        ),
      );
      const comissão: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.comissão,
          0,
        ),
      );
      const prestacao: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.prestacao,
          0,
        ),
      );
      const negativo: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.negativo,
          0,
        ),
      );
      const despesas: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.despesas,
          0,
        ),
      );
      const deposito: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.deposito,
          0,
        ),
      );
      const sangria: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) =>
            total + item.sangria,
          0,
        ),
      );
      const caixa: string = numberFormater(
        data.extrato.reduce(
          (total: number, item: EstabelecimentosExtrato) => total + item.caixa,
          0,
        ),
      );
      const estabelecimentos: number = data.extrato.length;
      const totalValue = [
        {
          label: "Total de Estabelecimentos",
          value: estabelecimentos,
        },
        {
          label: "Vendas",
          value: vendas,
        },
        {
          label: "Comissão",
          value: comissão,
        },
        {
          label: "Despesas",
          value: despesas,
        },
        {
          label: "Sangria",
          value: sangria,
        },
        {
          label: "Despesas",
          value: despesas,
        },
        {
          label: "Deposito",
          value: deposito,
        },
        {
          label: "Negativo",
          value: negativo,
        },
        {
          label: "Prestacao",
          value: prestacao,
        },
        {
          label: "Líquido",
          value: liquido,
        },
        {
          label: "Caixa",
          value: caixa,
        },
      ];
      setTotalValue(totalValue);
      setDataExtrato(data.extrato);
    } catch (error) {
      console.error("handleSubmitExtrato", error);
    }
  }

  return (
    <div>
      <form
        className="grid mt-4 gap-2"
        onSubmit={handleSubmit(handleSubmitExtrato)}
      >
        <div className="flex gap-4">
          <div className="grid gap-1">
            <Controller
              name="dataInicial"
              control={control}
              render={({ field }) => {
                return (
                  <div className="grid gap-2">
                    <div>
                      <label>Data inicial</label>
                    </div>
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
                              setDateFilter({
                                ...dateFilter,
                                date_inicial: data,
                              });
                              field.onChange(data);
                            } catch (error) {
                              console.error("Calendar", error);
                            }
                          }}
                          disabled={(date: Date) => {
                            if (dateFilter.date_final) {
                              return (
                                date > dateFilter.date_final ||
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              );
                            } else {
                              return (
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              );
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors["dataInicial"] && (
                      <ErrorMessageInput
                        className=" mt-0"
                        error={errors}
                        name={"dataInicial"}
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
          <div className="grid gap-1">
            <Controller
              name="dataFinal"
              control={control}
              render={({ field }) => {
                return (
                  <div className="grid gap-2">
                    <div>
                      <label>Data Final</label>
                    </div>
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
                            setDateFilter({
                              ...dateFilter,
                              date_final: data,
                            });
                            field.onChange(data);
                          }}
                          disabled={(date: Date) => {
                            if (dateFilter.date_inicial) {
                              return (
                                date < dateFilter.date_inicial ||
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              );
                            } else {
                              return (
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              );
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors["dataFinal"] && (
                      <ErrorMessageInput
                        className=" mt-0"
                        error={errors}
                        name={"dataFinal"}
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="grid gap-1">
            <Controller
              control={control}
              name="localidade"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Localidade</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Localidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataForForm.localidade &&
                        dataForForm.localidade.length > 0 ? (
                          dataForForm.localidade.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.name ? item.name : ""}
                            >
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
                  {errors["localidade"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"localidade"}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Controller
              control={control}
              name="secao"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Seção</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Seção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {secao && secao.length > 0 ? (
                          secao.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.name ? item.name : ""}
                            >
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
                  {errors["secao"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"secao"}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="grid gap-1">
            <Controller
              control={control}
              name="rota"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Rota</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      infoUser?.user.role === "supervisor" ? true : false
                    }
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Rota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataForForm.rota ? (
                          dataForForm.rota.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.label}
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
                  {errors["rota"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"rota"}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Controller
              control={control}
              name="supervisor"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Supervisor</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      infoUser?.user.role === "supervisor" ? true : false
                    }
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataForForm.supervisores ? (
                          dataForForm.supervisores.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.name ? item.name : ""}
                            >
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
                  {errors["supervisor"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"supervisor"}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 place-items-end">
          <div className="grid gap-1">
            <Controller
              control={control}
              name="estabelecimento"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Estabelecimento</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      infoUser?.user.role === "supervisor" ? true : false
                    }
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Estabelecimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataForForm.estabelecimento ? (
                          dataForForm.estabelecimento.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.id?.toString() as string}
                            >
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
                  {errors["estabelecimento"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"estabelecimento"}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Controller
              control={control}
              name="empresa"
              render={({ field }) => (
                <div
                  className={`grid gap-2 ${infoUser?.user.role !== "administrador" ? "hidden" : ""}`}
                >
                  <label>Empresa</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      infoUser?.user.role !== "administrador" ? true : false
                    }
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataForForm.empresa?.map((item, _) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors["estabelecimento"] && (
                    <ErrorMessageInput
                      className=" mt-0"
                      error={errors}
                      name={"estabelecimento"}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 place-items-end">
          <Button variant={"outline"} className="gap-2" disabled={isSubmitting}>
            <Search size={14} />
            <span>Filtar</span>
          </Button>
        </div>
      </form>
      <TotalValueTable data={totalValue} />
      <DataTableEstabelecimentos
        data={dataExtrato}
        className={dataExtrato.length > 0 ? "" : "hidden"}
      />
    </div>
  );
};
