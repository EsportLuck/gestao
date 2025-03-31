"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { useSupervisores } from "@/shared/hooks";

export function ReportTableSupervisores() {
  const { supervisores, isLoading, error } = useSupervisores();
  if (isLoading) {
    return <div className="container mx-auto mt-10 p-0">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-0">
        <div className="text-red-500">Falha ao carregar supervisores</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns as any} data={supervisores || []} />
    </div>
  );
}
