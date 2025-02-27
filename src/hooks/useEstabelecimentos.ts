import { useMemo } from "react";
import { Estabelecimento } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export function useEstabelecimentos() {
  const obterEstabelecimentos = useFetch<{
    estabelecimentos: Partial<Estabelecimento>[];
  }>("/api/v1/management/establishments");
  const estabelecimentos = useMemo(() => {
    if (
      obterEstabelecimentos.data &&
      obterEstabelecimentos.data.estabelecimentos?.length > 0
    ) {
      return obterEstabelecimentos.data.estabelecimentos.map(
        (estabelecimento) => ({
          ...estabelecimento,
          name: estabelecimento.name,
        }),
      );
    }
    return [];
  }, [obterEstabelecimentos.data]);

  return {
    estabelecimentos,
    isLoading: obterEstabelecimentos.isLoading,
    error: obterEstabelecimentos.error,
  };
}
