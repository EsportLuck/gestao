"use client";
import { useFetch } from "@/hooks/useFetch";
import { TImportacaoTable, columns } from "./columns";
import { DataTable } from "./data-table";
import { useContext, useEffect, useState } from "react";
import { ImportandoContext } from "@/context/importacaoContext";

export function ImportacaoReportTable() {
  const { importando } = useContext(ImportandoContext);
  const [dataTable, setDataTable] = useState<TImportacaoTable[]>([]);

  const result = useFetch<TImportacaoTable[]>(
    "/api/v1/imported-reports",
    importando,
  );
  useEffect(() => {
    setDataTable(result.data || []);
  }, [result.data]);

  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
