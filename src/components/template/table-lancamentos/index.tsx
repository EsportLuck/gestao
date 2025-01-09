import { LancamentosTable, columns } from "./columns";
import { DataTable } from "./data-table";
interface Props {
  data: LancamentosTable[];
}
export function TableLancamentos({ data }: Props) {
  return (
    <div className="container mx-auto mt-10 p-0 overflow-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
