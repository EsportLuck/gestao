import { Supervisor } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Supervisor[]> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/management/supervisores`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const supervisor: Supervisor[] = await response.json();

    if (supervisor.length === 0) return [];
    return supervisor;
  } catch (err) {
    return [];
  }
}

export async function ReportTableSupervisores() {
  const data = await getData();
  return (
    <div className="container mx-auto mt-10 p-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
