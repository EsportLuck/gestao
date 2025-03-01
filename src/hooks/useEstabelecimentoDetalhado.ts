import { useMemo } from "react";
import { Empresa, Estabelecimento } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export interface IEstabelecimentoDetalhado extends Partial<Estabelecimento> {
  localidade: string;
  supervisor: string;
  secao: string;
  empresa: Empresa;
  filiais: Partial<Estabelecimento>[];
  matriz: Partial<Estabelecimento> | null;
}
type EstabelecimentoResponse = {
  estabelecimentoDetalhado: IEstabelecimentoDetalhado;
};
export function useEstabelecimentoDetalhado(slug: string) {
  const { data, isLoading, error } = useFetch<EstabelecimentoResponse>(
    `/api/v1/management/establishments/details?id=${slug}`,
  );
  const estabelecimentoDetalhado = useMemo(() => {
    if (!data || isLoading) {
      return null;
    }
    return data.estabelecimentoDetalhado;
  }, [data, isLoading]);

  return {
    estabelecimentoDetalhado,
    isLoading,
    error,
    isError: !!error,
    isEmpty: !isLoading && !estabelecimentoDetalhado,
  };
}
