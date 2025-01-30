"use client";
import { Cronjob } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo } from "react";

import { useFetch } from "@/hooks/useFetch";

export function ReportTableCaixas() {
  const data = useFetch<Cronjob[]>("/api/v1/management/cronjob");
  const cronjob = useMemo<Cronjob[]>(() => data.data ?? [], [data.data]);
  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={cronjob} />
    </div>
  );
}
