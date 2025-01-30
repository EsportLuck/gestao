"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui";
import { ArrowUpDown } from "lucide-react";

import Link from "next/link";
import { Cronjob } from "@prisma/client";

const sortingColumn = (column: Column<Cronjob, unknown>, label: string) => {
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

export const columns: ColumnDef<Cronjob>[] = [
  {
    accessorKey: "Empresa",
    header: ({ column }) => sortingColumn(column, "Empresa"),
    cell: ({ row }) => {
      const cronjob = row.original.name;
      return (
        <div className={` text-left font-bol ml-4`}>
          <p>{cronjob}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "Data",
    header: ({ column }) => sortingColumn(column, "Data"),
    cell: ({ row }) => {
      const cronjob = row.original.date;
      return (
        <div className={` text-left font-bol ml-4`}>
          <p>
            {new Date(cronjob)
              .toISOString()
              .replace(/T.+Z/, "")
              .split("-")
              .reverse()
              .join("/")}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deletar = "Deletar";
      const id = row.original.id.toString();

      return (
        <div className={`text-left font-bol ml-4 `}>
          <Link
            className="hover:bg-accent-foreground/10 bg-accent p-2 rounded-sm dark:bg-accent/70 dark:hover:bg-accent/90 transition duration-300"
            href={`supervisores/${id}`}
          >
            {deletar}
          </Link>
        </div>
      );
    },
  },
];
