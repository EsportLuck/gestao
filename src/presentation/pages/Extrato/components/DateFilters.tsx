import { Dispatch, FC, SetStateAction } from "react";
import { Control } from "react-hook-form";
import { TFormSchema } from "../types";
import {
  Button,
  Calendar,
  ErrorMessageInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "@/utils";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

interface DateFiltersProps {
  control: Control<TFormSchema>;
  dateFilter: { date_inicial?: Date; date_final?: Date };
  setDateFilter: Dispatch<
    SetStateAction<{
      date_inicial: undefined | Date;
      date_final: undefined | Date;
    }>
  >;
  errors: any;
}

export const DateFilters: FC<DateFiltersProps> = ({
  control,
  dateFilter,
  setDateFilter,
  errors,
}) => {
  return (
    <div className="flex gap-4 col-span-1">
      {/* Date Initial */}
      <div className="w-full">
        <Controller
          name="dataInicial"
          control={control}
          render={({ field }) => (
            <div className="grid gap-1">
              <label className="text-sm text-muted-foreground">
                Data Inicial
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value)
                    ) : (
                      <span>Escolha uma dia</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(data) => {
                      setDateFilter((prev) => ({
                        ...prev,
                        date_inicial: data
                      }));
                      field.onChange(data);
                    }}
                    disabled={(date) =>
                      dateFilter.date_final
                        ? date > dateFilter.date_final ||
                          date > new Date() ||
                          date < new Date("1900-01-01")
                        : date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors["dataInicial"] && (
                <ErrorMessageInput
                  className="mt-1"
                  error={errors}
                  name={"dataInicial"}
                />
              )}
            </div>
          )}
        />
      </div>
      <div className="w-full">
        <Controller
          name="dataFinal"
          control={control}
          render={({ field }) => (
            <div className="grid gap-1">
              <label className="text-sm text-muted-foreground">
                Data Final
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value)
                    ) : (
                      <span>Escolha uma dia</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(data) => {
                      setDateFilter((prev) => ({
                        ...prev,
                        date_final: data
                      }));
                      field.onChange(data);
                    }}
                    disabled={(date) =>
                      dateFilter.date_final
                        ? date > dateFilter.date_final ||
                          date > new Date() ||
                          date < new Date("1900-01-01")
                        : date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors["dataFinal"] && (
                <ErrorMessageInput
                  className="mt-1"
                  error={errors}
                  name={"dataFinal"}
                />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};
