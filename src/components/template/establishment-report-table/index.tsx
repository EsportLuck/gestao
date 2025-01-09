import { TEstabelecimento } from "@/types/estabelecimento";
import { TReportEstablishment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<TReportEstablishment[]> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/management/establishments`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const estabelecimento: TEstabelecimento[] = await response.json();
    const estabelecimentos: TReportEstablishment[] = estabelecimento.map(
      (item) => {
        return {
          id: item.id.toString(),
          estabelecimento: item.name,
        };
      },
    );
    if (estabelecimentos.length === 0) return [];
    return estabelecimentos;
  } catch (err) {
    return [];
  }
}

export async function EstablishmentReportTable() {
  const data = await getData();
  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
