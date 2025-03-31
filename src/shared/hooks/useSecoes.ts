import { useMemo } from "react";
import { Secao } from "@prisma/client";
import { useFetch } from "@/shared/hooks/useFetch";

export function useSecoes() {
  const obterSecoes = useFetch<{ secoes: Partial<Secao>[] }>(
    "/api/v1/management/sections",
  );
  const secao = useMemo(() => {
    if (obterSecoes.data && obterSecoes.data.secoes?.length > 0) {
      return obterSecoes.data.secoes.map((secao) => ({
        ...secao,
        name: secao.name,
      }));
    }
    return [];
  }, [obterSecoes.data]);

  return {
    secao,
    isLoading: obterSecoes.isLoading,
    error: obterSecoes.error,
  };
}
