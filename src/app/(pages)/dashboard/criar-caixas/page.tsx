"use client";
import { FormCriarCaixas } from "@/components/(pages)/criar-caixas";
import { ReportTableCaixas } from "@/components/template";
import { useEmpresas } from "@/hooks";

export default function CriarCaixas() {
  const { empresas } = useEmpresas();

  return (
    <section>
      <FormCriarCaixas empresas={empresas} />
      <ReportTableCaixas />
    </section>
  );
}
