"use client";
import { FC } from "react";
import { useExtratoForm } from "./hooks/useExtratoForm";
import { DateFilters } from "./components/DateFilters";
import {
  DataTableEstabelecimentos,
  TotalValueTable,
} from "@/components/template";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui";
import { SelectFilters } from "./components/SelectFilters";

export const FormExtrato: FC = () => {
  const {
    control,
    formState,
    handleSubmit,
    handleSubmitExtrato,
    dateFilter,
    setDateFilter,
    dataExtrato,
    totalValue,
  } = useExtratoForm();

  const { isSubmitting, errors } = formState;

  return (
    <div className="bg-background text-foreground rounded-lg p-6 w-full max-w-6xl">
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitExtrato)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateFilters
            control={control}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            errors={errors}
          />
          <SelectFilters control={control} errors={errors} />
        </div>

        <div>
          <Button
            variant="default"
            className="flex items-center gap-2 px-6 py-2"
            disabled={isSubmitting}
          >
            <Filter size={18} />
            <span>Filtrar</span>
          </Button>
        </div>
      </form>

      {totalValue && (
        <div className="mt-6">
          <TotalValueTable data={totalValue} />
        </div>
      )}

      <div className={`mt-6 ${dataExtrato.length > 0 ? "" : "hidden"}`}>
        <DataTableEstabelecimentos data={dataExtrato} />
      </div>
    </div>
  );
};
