"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";
import { Actions } from "./components/actions";
export type TImportacaoTable = {
  id: string;
  state: string;
  name: string;
  relatorio: string;
  referenceDate: Date;
  createdAt: Date;
  modifiedBy: string;
};

const sortingColumn = (
  column: Column<TImportacaoTable, unknown>,
  label: string,
) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="capitalize text-center"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<TImportacaoTable>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => sortingColumn(column, "status"),
    cell: ({ row }) => {
      const status = row.original.state;
      function getStatus(status: string) {
        switch (status) {
          case "Importado":
            return "bg-green-400 text-green-700";
          case "Atualizado":
            return "bg-blue-400 text-blue-700";
          default:
            return "bg-red-400 text-red-700";
        }
      }
      return (
        <div
          className={` rounded-full text-center font-bold   ${getStatus(
            status,
          )}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "relatorio",
    header: ({ column }) => sortingColumn(column, "relatorio"),
    cell: ({ row }) => (
      <div className={`text-center font-medium }`}>
        {row.original.relatorio.charAt(0).toUpperCase() +
          row.original.relatorio.slice(1)}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => sortingColumn(column, "Importado por"),
    cell: ({ row }) => {
      const autor = row.original.name;

      return <div className={` text-center font-bold`}>{autor}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => sortingColumn(column, "Data da importação"),
    cell: ({ row }) => (
      <div className={`text-center font-medium }`}>
        {new Date(row.original.createdAt).toLocaleDateString("pt-BR")}
      </div>
    ),
  },
  {
    accessorKey: "referenceDate",
    header: ({ column }) => sortingColumn(column, "Dia do relátorio"),
    cell: ({ row }) => (
      <div className={`text-center font-medium }`}>
        {new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
          new Date(row.original.referenceDate),
        )}
      </div>
    ),
  },
  {
    accessorKey: "modifiedBy",
    header: ({ column }) => sortingColumn(column, "Modificado por"),
    cell: ({ row }) => (
      <div className={`text-center font-medium }`}>
        {row.original.modifiedBy}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const importação = row.original.id;

      return <Actions id={importação} row={row} />;
    },
  },
];
