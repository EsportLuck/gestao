import { useMemo } from "react";
import { Empresa } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export function useEmpresas() {
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

  return {
    empresas,
    isLoading: obterEmpresas.isLoading,
    error: obterEmpresas.error,
  };
}
