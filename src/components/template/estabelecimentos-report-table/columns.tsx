"use client";

import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { numberFormater } from "@/utils";
import { ModalLancamentoToTable } from "@/components/template";
import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";
import { formatarData } from "@/utils/formatarData";

type EstabelecimentosExtrato = {
  id: string;
  status: { status: string; reference_date: string }[];
  estabelecimento: string;
  quantidade: number;
  vendas: number;
  comissão: number;
  prêmios: number;
  líquido: number;
  deposito: number;
  sangria: number;
  despesas: number;
  prestacao: number;
  negativo: number;
  caixa: number;
};

const sortingColumn = (
  column: Column<EstabelecimentosExtrato, unknown>,
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
const getClassForComparisonValue = (number: number, premios?: string) => {
  if (number < 0 || premios) {
    return "text-red-600";
  }
  if (number > 0) {
    return "text-green-600";
  }
  return "text-foreground";
};

const formatLineValueToMonetary = (
  row: Row<EstabelecimentosExtrato>,
  rowValue: string,
  premio?: string,
) => {
  const amount = parseFloat(row.getValue(`${rowValue}`));
  const formatted = numberFormater(amount);

  return (
    <div
      className={`text-right font-medium ${getClassForComparisonValue(amount, premio)}`}
    >
      {formatted}
    </div>
  );
};

const totalColumnValue = (
  table: Table<EstabelecimentosExtrato>,
  column: string,
  premio?: string,
) => {
  const valeusRowInArray: Array<number> = table.getCenterRows().map((row) => {
    return row.getValue(column);
  });

  const sumRowValues = valeusRowInArray.reduce((acc, curr) => acc + curr, 0);

  return (
    <div
      key={sumRowValues}
      className={`text-right font-medium ${getClassForComparisonValue(sumRowValues, premio)}`}
    >
      {numberFormater(sumRowValues)}
    </div>
  );
};

const columns: ColumnDef<EstabelecimentosExtrato>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => sortingColumn(column, "status"),
    cell: ({ row }) => {
      const statusOptions = row.original.status;

      return statusOptions.map((statusOption) => {
        const date = formatarData(statusOption.reference_date);
        const obterCiclo = obterInicioEFimDoCiclo(date);

        return (
          <div
            key={statusOption.reference_date.toString()}
            title={
              obterCiclo.inicioDoCiclo.toLocaleDateString() +
              " - " +
              obterCiclo.finalDoCiclo.toLocaleDateString()
            }
            className={` rounded-full text-center font-bold  ${
              statusOption.status.toLowerCase() === "pago"
                ? "bg-green-400 text-green-600 hidden"
                : "bg-yellow-400 text-yellow-600"
            }`}
          >
            {statusOption.status.toLowerCase()}
          </div>
        );
      });
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
    accessorKey: "quantidade",
    header: ({ column }) => sortingColumn(column, "quantidade"),
    cell: ({ row }) => (
      <div className={`text-right font-medium`}>{row.original.quantidade}</div>
    ),
    footer: ({ table }) => {
      const valeusRowInArray: Array<number> = table
        .getCenterRows()
        .map((row) => {
          return row.getValue("quantidade");
        });

      const sumRowValues = valeusRowInArray.reduce(
        (acc, curr) => acc + curr,
        0,
      );
      return (
        <div key={sumRowValues} className={`text-right font-medium `}>
          {sumRowValues}
        </div>
      );
    },
  },
  {
    accessorKey: "vendas",
    header: ({ column }) => sortingColumn(column, "vendas"),
    cell: ({ row }) => formatLineValueToMonetary(row, "vendas"),
    footer: ({ table }) => totalColumnValue(table, "vendas"),
  },
  {
    accessorKey: "comissão",
    header: ({ column }) => sortingColumn(column, "comissão"),
    cell: ({ row }) => formatLineValueToMonetary(row, "comissão", "comissão"),
    footer: ({ table }) => totalColumnValue(table, "comissão", "comissão"),
  },
  {
    accessorKey: "prêmios",
    header: ({ column }) => sortingColumn(column, "prêmios"),
    cell: ({ row }) => formatLineValueToMonetary(row, "prêmios", "premios"),
    footer: ({ table }) => totalColumnValue(table, "prêmios", "premios"),
  },
  {
    accessorKey: "líquido",
    header: ({ column }) => sortingColumn(column, "líquido"),
    cell: ({ row }) => formatLineValueToMonetary(row, "líquido"),
    footer: ({ table }) => totalColumnValue(table, "líquido"),
  },
  {
    accessorKey: "deposito",
    header: ({ column }) => sortingColumn(column, "deposito"),
    cell: ({ row }) => formatLineValueToMonetary(row, "deposito", "deposito"),
    footer: ({ table }) => totalColumnValue(table, "deposito", "deposito"),
  },
  {
    accessorKey: "sangria",
    header: ({ column }) => sortingColumn(column, "sangria"),
    cell: ({ row }) => formatLineValueToMonetary(row, "sangria"),
    footer: ({ table }) => totalColumnValue(table, "sangria"),
  },
  {
    accessorKey: "despesas",
    header: ({ column }) => sortingColumn(column, "despesas"),
    cell: ({ row }) => formatLineValueToMonetary(row, "despesas", "despesas"),
    footer: ({ table }) => totalColumnValue(table, "despesas", "despesas"),
  },
  {
    accessorKey: "negativo",
    header: ({ column }) => sortingColumn(column, "negativo"),
    cell: ({ row }) => formatLineValueToMonetary(row, "negativo", "negativo"),
    footer: ({ table }) => totalColumnValue(table, "negativo", "negativo"),
  },
  {
    accessorKey: "prestacao",
    header: ({ column }) => sortingColumn(column, "prestacao"),
    cell: ({ row }) => formatLineValueToMonetary(row, "prestacao"),
    footer: ({ table }) => totalColumnValue(table, "prestacao"),
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
      const estabelecimento = {
        id: row.original.id,
        name: row.original.estabelecimento,
      };

      const disabled = true;
      return (
        <DropdownMenu modal={false} key={row.original.id}>
          <DropdownMenuTrigger asChild>
            <Button disabled={disabled} variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          {disabled ? null : (
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ModalLancamentoToTable estabelecimento={estabelecimento} />
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      );
    },
  },
];

export type { EstabelecimentosExtrato };
export { columns };
