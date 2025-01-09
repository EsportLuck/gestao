"use client";
import React, { FC, useMemo } from "react";
import { DataTableEstabelecimentos } from "@/components/template";
import { useSession } from "next-auth/react";
import { useFetch } from "@/hooks/useFetch";
import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";

const Dashboard: FC = () => {
  const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(new Date());
  const { data } = useSession();
  const url = useMemo(() => {
    if (!data) return null;
    const queryParams = new URLSearchParams({
      dataInicial: inicioDoCiclo.toISOString(),
      dataFinal: finalDoCiclo.toISOString(),
      localidade: "undefined",
      secao: "undefined",
      rota: "undefined",
      supervisor: "undefined",
      estabelecimento: "undefined",
      role: data?.user.role,
      username: data?.user.username,
      site: data?.user.site,
    }).toString();

    return `/api/v1/extract?${queryParams}`;
  }, [data, inicioDoCiclo, finalDoCiclo]);

  const estabelecimentos = useFetch<{ extrato: any }>(url!, Boolean(url));

  return (
    <main>
      <DataTableEstabelecimentos data={estabelecimentos.data?.extrato || []} />
    </main>
  );
};

export default Dashboard;
