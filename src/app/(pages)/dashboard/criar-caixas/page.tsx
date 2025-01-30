"use client";

import { useFetch } from "@/hooks/useFetch";
import { Empresa } from "@prisma/client";
import { useMemo } from "react";
import { FormCriarCaixas } from "@/components/(pages)/criar-caixas";
import { ReportTableCaixas } from "@/components/template";

export default function CriarCaixas() {
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

  return (
    <section>
      <FormCriarCaixas empresas={empresas} />
      <ReportTableCaixas />
    </section>
  );
}
