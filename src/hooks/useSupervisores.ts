import { useMemo } from "react";
import { Supervisor } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";

export function useSupervisores() {
  const obterSupervisores = useFetch<{ supervisores: Partial<Supervisor>[] }>(
    "/api/v1/management/supervisores",
  );
  const supervisores = useMemo(() => {
    if (
      obterSupervisores.data &&
      obterSupervisores.data.supervisores?.length > 0
    ) {
      return obterSupervisores.data.supervisores.map((supervisor) => ({
        ...supervisor,
        name: supervisor.name,
      }));
    }
    return [];
  }, [obterSupervisores.data]);

  return {
    supervisores,
    isLoading: obterSupervisores.isLoading,
    error: obterSupervisores.error,
  };
}
