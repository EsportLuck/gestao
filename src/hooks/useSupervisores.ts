import { useMemo } from "react";
import { Supervisor } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export function useSupervisores() {
  const { data, error, isLoading } = useFetch<{
    supervisores: Partial<Supervisor>[];
  }>("/api/v1/management/supervisores");
  const supervisores = useMemo(() => {
    if (!data || isLoading) {
      return null;
    }
    return data.supervisores;
  }, [data, isLoading]);

  return {
    supervisores,
    isLoading: isLoading,
    error: error,
  };
}
