import { FC } from "react";

interface IValueCard {
  label: string;
  value: string | number;
}
export const ValueCard: FC<IValueCard> = ({ label, value }) => {
  return (
    <div className="max-w-[300px] flex justify-between gap-8 text-center border rounded-sm p-4 border-t bg-muted/30 font-medium hover:bg-accent cursor-default">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
};
