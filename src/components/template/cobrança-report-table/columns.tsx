"use client";

import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { numberFormater } from "@/utils";
export type CobrancaTable = {
  id: string;
  status: "pendente" | "pago";
  estabelecimento: string;
  caixa: number;
};

const sortingColumn = (
  column: Column<CobrancaTable, unknown>,
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
const getClassForComparisonValue = (number: number) => {
  if (number < 0) {
    return "text-red-600";
  }
  if (number > 0) {
    return "text-green-600";
  }
  return "text-foreground";
};

const formatLineValueToMonetary = (
  row: Row<CobrancaTable>,
  rowValue: string,
) => {
  const amount = parseFloat(row.getValue(`${rowValue}`));
  const formatted = numberFormater(amount);

  return <div className={`text-center font-medium }`}>{formatted}</div>;
};

const totalColumnValue = (table: Table<CobrancaTable>, column: string) => {
  const valeusRowInArray: Array<number> = table.getCenterRows().map((row) => {
    return row.getValue(column);
  });
  const sumRowValues = valeusRowInArray.reduce((acc, curr) => acc + curr, 0);
  return (
    <div
      key={sumRowValues}
      className={`text-center font-medium ${getClassForComparisonValue(sumRowValues)}`}
    >
      {numberFormater(sumRowValues)}
    </div>
  );
};

export const columns: ColumnDef<CobrancaTable>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => sortingColumn(column, "status"),
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div
          className={` rounded-full text-center font-bold   ${
            status === "pago"
              ? "bg-green-400 text-green-600"
              : "bg-yellow-400 text-yellow-600"
          }`}
        >
          {status}
        </div>
      );
    },
    footer: () => <div className="text-foreground text-center">Total</div>,
  },
  {
    accessorKey: "estabelecimento",
    header: ({ column }) => sortingColumn(column, "estabelecimento"),
    cell: ({ row }) => {
      const estabelecimento = row.original.estabelecimento;

      return <div className={` text-center font-bold`}>{estabelecimento}</div>;
    },
  },

  {
    accessorKey: "caixa",
    header: ({ column }) => sortingColumn(column, "caixa"),
    cell: ({ row }) => formatLineValueToMonetary(row, "caixa"),
    footer: ({ table }) => totalColumnValue(table, "caixa"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu modal={false} key={row.original.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
