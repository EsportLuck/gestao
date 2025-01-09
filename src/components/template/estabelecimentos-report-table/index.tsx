import { EstabelecimentosExtrato, columns } from "./columns";
import { DataTable } from "./data-table";
export const DataTableEstabelecimentos: React.FC<{
  data: EstabelecimentosExtrato[] | [];
  className?: string;
}> = ({ data, className }) => {
  return (
    <div className={`container mx-auto mt-10 p-0 ${className}`}>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
