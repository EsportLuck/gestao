import { useMemo } from "react";
import { Estabelecimento } from "@prisma/client";
import { useFetch } from "@/shared/hooks/useFetch";

type TMatrizResponse = {
  matrizes: Partial<Estabelecimento>[];
};

export function useMatrizes() {
  const { data, error, isLoading } = useFetch<TMatrizResponse>(
    "/api/v1/management/companies",
  );
  const matrizes = useMemo(() => {
    if (!data || isLoading === true) {
      return null;
    }
    return data.matrizes.map((matriz) => ({
      ...matriz,
      name: matriz.name,
    }));
  }, [data, isLoading]);

  return {
    matrizes,
    isLoading,
    error,
  };
}
