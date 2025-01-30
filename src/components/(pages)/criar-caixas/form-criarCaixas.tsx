"use client";
"use client";
import { LoadingSpinnerModal } from "@/components/template";
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  useToast,
} from "@/components/ui";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "@/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleForm } from "./utils";

const FormSchemaCriarCaixas = z.object({
  date: z.date({
    required_error: "Escolha um dia",
  }),
  empresa: z.string({
    required_error: "Escolha uma empresa",
  }),
});

type TFormSchemaCriarCaixas = z.infer<typeof FormSchemaCriarCaixas>;
export function FormCriarCaixas({
  empresas,
}: {
  empresas: {
    name: string | undefined;
    id?: number | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
  }[];
}) {
  const { data: session } = useSession();
  const form = useForm<TFormSchemaCriarCaixas>({
    resolver: zodResolver(FormSchemaCriarCaixas),
    mode: "onChange",
  });
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        className={`grid gap-3 place-items-start mt-6 ${isSubmitting ? "cursor-progress" : ""} `}
        encType="multipart/form-data"
        onSubmit={form.handleSubmit((context) => {
          handleForm({ form: context, session });
        })}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            return (
              <FormItem className="grid">
                <FormLabel className="decoration-foreground">
                  Data de referência
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="empresa"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(empresa) => {
                  field.onChange(empresa);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[240px]">
                    <Button
                      placeholder="Escolha uma Empresa"
                      style={{ all: "unset" }}
                      asChild
                    >
                      <span>
                        {field.value ? field.value : "Escolha uma Empresa"}
                      </span>
                    </Button>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {empresas.length > 0 ? (
                      empresas.map((item) => (
                        <SelectItem key={item.id} value={item.name as string}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Crie uma Empresa">
                        Crie uma Empresa
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          variant={isSubmitting ? "destructive" : "default"}
          type="submit"
        >
          Criar Caixas
        </Button>
        <LoadingSpinnerModal open={isSubmitting} title={"Criando"} />
      </form>
    </Form>
  );
}
