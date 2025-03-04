"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";

import Link from "next/link";
import { Supervisor } from "@prisma/client";

const sortingColumn = (column: Column<Supervisor, unknown>, label: string) => {
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

export const columns: ColumnDef<Supervisor>[] = [
  {
    accessorKey: "supervisores",
    header: ({ column }) => sortingColumn(column, "supervisores"),
    cell: ({ row }) => {
      const supervisor = row.original.name;
      const id = row.original.id.toString();
      return (
        <div className={` text-left font-bol ml-4`}>
          <Link href={`supervisores/${id}`}>{supervisor}</Link>
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
            href={`supervisores/${id}`}
          >
            {detalhar}
          </Link>
        </div>
      );
    },
  },
];
