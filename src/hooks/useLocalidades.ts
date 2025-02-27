import { useMemo } from "react";
import { Localidade } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export function useLocalidades() {
  const obterLocalidades = useFetch<{ localidades: Partial<Localidade>[] }>(
    "/api/v1/management/locations",
  );
  const localidades = useMemo(() => {
    if (
      obterLocalidades.data &&
      obterLocalidades.data.localidades?.length > 0
    ) {
      return obterLocalidades.data.localidades.map((localidade) => ({
        ...localidade,
        name: localidade.name,
      }));
    }
    return [];
  }, [obterLocalidades.data]);

  return {
    localidades,
    isLoading: obterLocalidades.isLoading,
    error: obterLocalidades.error,
  };
}
