import { FC } from "react";
import { ValueCard } from "@/components/ui";

interface ITotalValueTable {
  data: any[] | undefined;
}

export const TotalValueTable: FC<ITotalValueTable> = ({ data }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 ">
      {data?.map((item, index) => (
        <ValueCard key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};
