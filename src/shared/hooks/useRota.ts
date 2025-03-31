import { useMemo } from "react";
import { Rota } from "@prisma/client";
import { useFetch } from "@/shared/hooks/useFetch";

export function useRota() {
  const obterRota = useFetch<{ rotas: Partial<Rota>[] }>(
    "/api/v1/management/routes",
  );
  const rotas = useMemo(() => {
    if (obterRota.data && obterRota.data.rotas?.length > 0) {
      return obterRota.data.rotas.map((rota) => ({
        ...rota,
        name: rota.name,
      }));
    }
    return [];
  }, [obterRota.data]);

  return {
    rotas,
    isLoading: obterRota.isLoading,
    error: obterRota.error,
  };
}
