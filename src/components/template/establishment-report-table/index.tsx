"use client";
import { TEstabelecimento } from "@/types/estabelecimento";
import { TReportEstablishment, columns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";

export default function EstablishmentReportTable() {
  const dataEstabelecimento = useFetch<TEstabelecimento[]>(
    "/api/v1/management/establishments",
  );
  const data = useMemo<TReportEstablishment[]>((): TReportEstablishment[] => {
    const estabelecimentos = dataEstabelecimento.data;
    if (!estabelecimentos) return [];
    return estabelecimentos.map((item) => {
      const data: TReportEstablishment = {
        id: item.id.toString(),
        estabelecimento: item.name,
      };
      return data;
    });
  }, [dataEstabelecimento.data]);

  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
