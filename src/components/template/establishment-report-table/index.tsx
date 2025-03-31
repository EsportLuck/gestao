"use client";
import { columns, TReportEstablishment } from "./columns";
import { DataTable } from "./data-table";
import { useEstabelecimentos } from "@/shared/hooks";

export default function EstablishmentReportTable() {
  const { estabelecimentos } = useEstabelecimentos();

  const estabelecimentosParaTabela: TReportEstablishment[] =
    estabelecimentos.map((estabelecimentos) => {
      return {
        id: estabelecimentos.id?.toString() || "",
        estabelecimento: estabelecimentos.name || "",
      };
    });

  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={estabelecimentosParaTabela} />
    </div>
  );
}
