import { FC } from "react";

interface IValueCard {
  label: string;
  value: string | number;
}

export const ValueCard: FC<IValueCard> = ({ label, value }) => {
  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 
        p-6 rounded-lg border border-border/50 
        bg-card hover:bg-accent/5 
        shadow-sm hover:shadow-md dark:shadow-slate-900/50 dark:hover:shadow-slate-800/50
        transition-all duration-200 ease-in-out 
        group cursor-default"
      role="article"
      aria-label={`${label}: ${value}`}
    >
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      <p className="text-xl font-semibold text-foreground">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
};
