"use client";
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  useToast,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "@/utils";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { ImportandoContext } from "@/context/importacaoContext";
import { reportOptions } from "./selectOptions";
import { LoadingSpinnerModal } from "@/components/template";
import { useFetch } from "@/hooks/useFetch";
import { Empresa } from "@prisma/client";

const FormSchema = z.object({
  date: z.date({
    required_error: "Escolha um dia",
  }),
  site: z.string({
    required_error: "Escolha um site",
  }),
  empresa: z.string({
    required_error: "Escolha um site",
  }),
  file: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList)
  ).refine((file) => file?.length > 0, "Informe um arquivo"),
});

type TFormSchema = z.infer<typeof FormSchema>;

interface IDataForm {
  site?: string;
  empresa?: string;
}

export const FormImport: FC = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });
  const { isSubmitting } = form.formState;
  const { importando, setImportando } = useContext(ImportandoContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataForm, setDataForm] = useState<IDataForm>({
    site: undefined,
    empresa: undefined,
  });
  const [selectOptions, setSelectOptions] = useState([
    {
      site: "Escolha uma Empresa",
    },
  ]);

  const obterEmpresas = useFetch<{ empresas: Partial<Empresa>[] }>(
    "/api/v1/management/empresa/obterTodas",
  );
  const empresas = useMemo(() => {
    console.log({ empresas: obterEmpresas.data });
    if (obterEmpresas.data && obterEmpresas.data.empresas.length > 0) {
      return obterEmpresas.data.empresas.map((empresa) => ({
        ...empresa,
        name: empresa.name,
      }));
    }
    return [];
  }, [obterEmpresas.data]);
  console.log({ empresas2: empresas });
  useEffect(() => {
    setSelectOptions(reportOptions(dataForm.empresa));
  }, [dataForm.empresa]);

  async function handleForm(data: FieldValues) {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("site", data.site);
    formData.append("empresa", data.empresa);
    formData.append("date", data.date);
    formData.append("user", session?.user.username as string);
    try {
      const response = await axios.post("/api/v1/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === 200) {
        toast({
          description: (
            <code className="text-slate-200">{response.data.message}</code>
          ),
          variant: "success",
        });
      } else {
        toast({
          description: (
            <pre className="rounded-md p-4">
              <code className="text-slate-200 text-wrap">
                {response.data.message}
              </code>
            </pre>
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: (
            <pre className="rounded-md p-4">
              <code className="text-slate-200 text-wrap">{error.message}</code>
            </pre>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          description: (
            <pre className="rounded-md p-4">
              <code className="text-slate-200 text-wrap">
                Verifique se você preencheu as informações de maneira correta
              </code>
            </pre>
          ),
          variant: "destructive",
        });
      }
    } finally {
      setImportando(!importando);
    }
  }

  return (
    <Form {...form}>
      <form
        className={`grid gap-3 place-items-start mt-6 ${isSubmitting ? "cursor-progress" : ""} `}
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(handleForm)}
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
                  setDataForm({ ...dataForm, empresa });
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
        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(site) => {
                  field.onChange(site);
                }}
                defaultValue={field.value || ""}
                value={field.value}
              >
                <SelectTrigger className="w-[240px]">
                  <Button
                    placeholder="Escolha um site"
                    style={{ all: "unset" }}
                    asChild
                  >
                    <span>{field.value ? field.value : "Escolha um site"}</span>
                  </Button>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {selectOptions.map((item) => (
                      <SelectItem
                        key={item.site}
                        value={item.site.toLocaleLowerCase()}
                      >
                        {item.site}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.html, .htm"
                  onChange={(file) => {
                    field.onChange(file.target.files);
                  }}
                  ref={inputRef}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          variant={isSubmitting ? "destructive" : "default"}
          type="submit"
        >
          Importar
        </Button>
        <LoadingSpinnerModal open={isSubmitting} title={"Importando"} />
      </form>
    </Form>
  );
};
