import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { formSchema, TFormSchema, TotalValueItem } from "../types";
import { EstabelecimentosExtrato } from "@/components/template/estabelecimentos-report-table/columns";
import { ErrorHandlerAdapter } from "@/presentation/adapters";
import { numberFormater } from "@/utils";

export const useExtratoForm = () => {
  const { data: infoUser } = useSession();
  const { handleSubmit, formState, control } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [dateFilter, setDateFilter] = useState<{
    date_inicial: undefined | Date;
    date_final: undefined | Date;
  }>({
    date_inicial: undefined,
    date_final: undefined,
  });

  const [dataExtrato, setDataExtrato] = useState<EstabelecimentosExtrato[]>([]);
  const [totalValue, setTotalValue] = useState<TotalValueItem[] | undefined>();

  const calculateTotalValues = (data: { extrato: EstabelecimentosExtrato[] }) => {
    const calculateTotal = (field: keyof EstabelecimentosExtrato) =>
      numberFormater(
        data.extrato.reduce((total, item) => total + (item[field] as number), 0)
      );

    return [
      { label: "Total de Estabelecimentos", value: data.extrato.length },
      { label: "Vendas", value: calculateTotal("vendas") },
      { label: "Comissão", value: calculateTotal("comissão") },
      { label: "Despesas", value: calculateTotal("despesas") },
      { label: "Sangria", value: calculateTotal("sangria") },
      { label: "Deposito", value: calculateTotal("deposito") },
      { label: "Negativo", value: calculateTotal("negativo") },
      { label: "Prestacao", value: calculateTotal("prestacao") },
      { label: "Líquido", value: calculateTotal("líquido") },
      { label: "Caixa", value: calculateTotal("caixa") },
    ];
  };

  const handleSubmitExtrato = async (formData: TFormSchema) => {
    try {
      const queryParams = new URLSearchParams({
        dataInicial: String(formData.dataInicial || ""),
        dataFinal: String(formData.dataFinal || ""),
        localidade: String(formData.localidade || ""),
        secao: String(formData.secao || ""),
        rota: String(formData.rota || ""),
        supervisor: String(formData.supervisor || ""),
        estabelecimento: String(formData.estabelecimento || ""),
        role: String(infoUser?.user.role || ""),
        username: String(infoUser?.user.username || ""),
        site: String(infoUser?.user.site || ""),
        empresa: String(formData.empresa || ""),
      });

      const response = await fetch(`/api/v1/extract?${queryParams.toString()}`, {
        method: "GET",
        cache: "default",
      });
      const data = await response.json();

      const totalValues = calculateTotalValues(data);
      setTotalValue(totalValues);
      setDataExtrato(data.extrato);
    } catch (error) {
      const errorAdapter = new ErrorHandlerAdapter();
      return errorAdapter.handle(error);
    }
  };

  return {
    control,
    formState,
    handleSubmit,
    handleSubmitExtrato,
    dateFilter,
    setDateFilter,
    dataExtrato,
    totalValue,
  };
};