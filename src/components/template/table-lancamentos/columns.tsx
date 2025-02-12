import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { ArrowUpDown, View } from "lucide-react";
import { numberFormater } from "@/utils";
import Image from "next/image";
import { LancamentoDropMenu } from "./components/lancamento-drop-menu";

export type LancamentosTable = {
  id: string;
  status: "analise" | "reprovado" | "aprovado";
  data: Date;
  valor: number;
  url: string;
  responsavel: string;
  estabelecimento: string;
  tipo: "despesa" | "pagamento" | "recebimento";
  estabelecimento_id: number;
  observacoes: { id: number; comentario: string; createdBy: string }[];
  id_ciclo?: number;
};

const sortingColumn = (
  column: Column<LancamentosTable, unknown>,
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

const statusColor = (status: "reprovado" | "analise" | "aprovado") => {
  switch (status) {
    case "analise":
      return "bg-yellow-400 text-yellow-700";
    case "reprovado":
      return "bg-red-400 text-red-700";
    case "aprovado":
      return "bg-green-400 text-green-700";
  }
};

const totalColumnValue = (table: Table<LancamentosTable>, column: string) => {
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

export const columns: ColumnDef<LancamentosTable>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => sortingColumn(column, "status"),
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div
          className={` rounded-full text-center font-bold   ${statusColor(status)}`}
        >
          {status}
        </div>
      );
    },
    footer: () => <div className="text-foreground text-center">Total</div>,
  },
  {
    accessorKey: "data",
    header: ({ column }) => sortingColumn(column, "data"),
    cell: ({ row }) => {
      const data = row.original.data.toString();
      const [ano, mes, dia] = data.split("T")[0].split("-");
      const dataFormat = `${dia}/${mes}/${ano}`;
      return <div className={`text-center font-bold`}>{dataFormat}</div>;
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => sortingColumn(column, "valor"),
    cell: ({ row }) => (
      <div className=" text-center font-bold">
        {numberFormater(row.original.valor)}
      </div>
    ),
    footer: ({ table }) => totalColumnValue(table, "valor"),
  },
  {
    accessorKey: "anexo",
    header: ({ column }) => sortingColumn(column, "anexo"),
    cell: ({ row }) => {
      {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="max-w-[425px]">
                <View />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Comprovante</DialogTitle>
                <DialogDescription>
                  Documento que foi enviado para o caixa.
                </DialogDescription>
              </DialogHeader>
              {row.original.url.length && row.original.url.includes(".pdf") ? (
                <iframe
                  width={300}
                  height={480}
                  src={row.original.url}
                  className="mx-auto"
                />
              ) : (
                <Image
                  width={300}
                  height={480}
                  src={row.original.url}
                  alt="comprovante"
                />
              )}
            </DialogContent>
          </Dialog>
        );
      }
    },
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => sortingColumn(column, "tipo"),
    cell: ({ row }) => (
      <div className="text-center font-bold border rounded-full py-2 px-4 cursor-default hover:bg-accent">
        {row.original.tipo}
      </div>
    ),
  },
  {
    accessorKey: "estabelecimento",
    header: ({ column }) => sortingColumn(column, "estabelecimento"),
    cell: ({ row }) => (
      <div className=" text-center font-bold">
        {row.original.estabelecimento}
      </div>
    ),
  },
  {
    accessorKey: "responsavel",
    header: ({ column }) => sortingColumn(column, "responsavel"),
    cell: ({ row }) => (
      <div className="text-center font-bold border rounded py-1 cursor-default hover:bg-accent">
        {row.original.responsavel}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <LancamentoDropMenu
          id={row.original.id}
          status={row.original.status}
          data={row.original.data}
          estabelecimento_id={row.original.estabelecimento_id}
          tipo={row.original.tipo}
          valor={row.original.valor}
          observacoes={row.original.observacoes}
          id_ciclo={row.original.id_ciclo}
        />
      );
    },
  },
];
