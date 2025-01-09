"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui";
import { ArrowUpDown } from "lucide-react";

import Link from "next/link";
export type TReportEstablishment = {
  id: string;
  estabelecimento: string;
};

const sortingColumn = (
  column: Column<TReportEstablishment, unknown>,
  label: string,
) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="capitalize"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<TReportEstablishment>[] = [
  {
    accessorKey: "estabelecimento",
    header: ({ column }) => sortingColumn(column, "estabelecimento"),
    cell: ({ row }) => {
      const estabelecimento = row.original.estabelecimento;
      const id = row.original.id.toString();
      return (
        <div className={` text-left font-bol ml-4`}>
          <Link href={`reportestabelecimentos/${id}`}>{estabelecimento}</Link>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const detalhar = "Detalhar";
      const id = row.original.id.toString();

      return (
        <div className={`text-left font-bol ml-4 `}>
          <Link
            className="hover:bg-accent-foreground/10 bg-accent p-2 rounded-sm dark:bg-accent/70 dark:hover:bg-accent/90 transition duration-300"
            href={`reportestabelecimentos/${id}`}
          >
            {detalhar}
          </Link>
        </div>
      );
    },
  },
];
