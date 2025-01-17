"use client";
import { Supervisor } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo } from "react";

import { useFetch } from "@/hooks/useFetch";

export function ReportTableSupervisores() {
  const data = useFetch<Supervisor[]>("/api/v1/management/supervisores");

  const supervisores = useMemo<Supervisor[]>(
    () => data.data ?? [],
    [data.data],
  );
  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={supervisores} />
    </div>
  );
}
