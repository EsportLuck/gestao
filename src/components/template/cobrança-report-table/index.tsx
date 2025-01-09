import { CobrancaTable, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<CobrancaTable[]> {
  return [
    {
      id: "728ed52f",
      status: "pendente",
      estabelecimento: "Burger King",

      caixa: 200,
    },
    {
      id: "728ed51f",
      status: "pago",
      estabelecimento: "Mc D. Onalds",

      caixa: 100,
    },

    // ...
  ];
}

export async function CobrancaReportTable() {
  const data = await getData();

  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
