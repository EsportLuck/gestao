"use client";

import { FC, useRef } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Calendar,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  toast,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { TEstabelecimento } from "@/types/estabelecimento";
import { format } from "@/utils";
import { useSession } from "next-auth/react";
import { ComboboxEstablishment } from "@/components/template";
import { useRouter } from "next/navigation";
import { useMatrizes } from "@/hooks";
import { HttpStatusCode } from "@/domain/enum";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { ErrorHandlerAdapter } from "@/presentation/adapters/ErrorHandlerAdapter";

const FormSchema = z.object({
  data_lancamento: z.date({
    required_error: "Escolha um dia",
  }),
  tipo: z.string({ required_error: "Escolha um tipo" }),
  forma_pagamento: z.string({ required_error: "Escolha uma forma" }),
  estabelecimento: z.string({ required_error: "Escolha um estabelecimento" }),
  comprovante: (typeof window === "undefined"
    ? z.any({ required_error: "Adicione um comprovante" })
    : z.instanceof(FileList)
  ).refine(
    (file) => {
      return file?.length > 0;
    },
    {
      message: "Informe um arquivo",
    },
  ),
  valor: z.string({ required_error: "Adicione um valor" }).min(0.01),
  observacao: z.string({ required_error: "Adicione uma observacao" }),
});
type TFormSchema = z.infer<typeof FormSchema>;
export const ModalLancamento: FC = () => {
  const { matrizes } = useMatrizes();

  const formRef = useRef<HTMLFormElement | null>(null);
  const closedRef = useRef<HTMLButtonElement | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      data_lancamento: new Date(),
      tipo: "",
      forma_pagamento: "",
      estabelecimento: "",
      comprovante: "",
      valor: "",
      observacao: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function formSubmit(data: TFormSchema) {
    let closed = closedRef.current;
    closed?.click();
    const user = session?.user.username as string;
    if (typeof user !== "string") {
      router.push("/");
      throw new Error("Usuário não autenticado");
    }
    const formData = new FormData();

    formData.append("tipo", data.tipo);
    formData.append("forma_pagamento", data.forma_pagamento);
    formData.append("estabelecimentoId", JSON.parse(data.estabelecimento).id);
    formData.append("comprovante", data.comprovante[0]);
    formData.append("valor", data.valor);
    formData.append("observacao_comprovante", data.observacao);
    formData.append("user", user);
    formData.append("date_reference", data.data_lancamento.toString());
    try {
      const fetch = new FetchHttpClient();
      const { data } = await fetch.post<{
        message: string;
        status: number;
      }>("/api/v1/entering/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.message === "Usuário não permitido") {
        toast({
          title: "Erro ao criar lançamento Usuário não permitido",
          variant: "destructive",
          description: (
            <code className="text-white text-wrap">{data.message}</code>
          ),
        });
        router.push("/");

        return null;
      }

      if (data.status !== HttpStatusCode.CREATED) {
        return toast({
          title: "Erro ao criar lançamento",
          variant: "destructive",
          description: (
            <code className="text-white text-wrap">{data.message}</code>
          ),
        });
      }
      toast({
        description: <code className="text-white">{data.message}</code>,
        variant: "success",
      });
    } catch (error) {
      const errorAdapter = new ErrorHandlerAdapter();
      return errorAdapter.handle(error);
    }
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4 py-4"
        onSubmit={form.handleSubmit(formSubmit)}
        ref={formRef}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="max-w-[425px]">
              Criar novo lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-dvh overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lancamento</DialogTitle>
              <DialogDescription>
                Crie lancamento para os estabelecimentos
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                name="data_lancamento"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid">
                    <FormLabel>Data Lançamento</FormLabel>
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
                          onSelect={(data) => {
                            field.onChange(data);
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
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Tipo de lançamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Lançamento" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="despesa">Despesa</SelectItem>
                          <SelectItem value="sangria">Sangria</SelectItem>
                          <SelectItem value="deposito">Deposito</SelectItem>
                          <SelectItem value="negativo">Negativo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="forma_pagamento"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <label>Escolha um forma de pagamento</label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Pagamento" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="pix">Pix</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="estabelecimento"
                render={({ field }) => (
                  <ComboboxEstablishment
                    establishments={matrizes as TEstabelecimento[]}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="comprovante"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <label>Selecione o comprovante</label>
                    <Input
                      type="file"
                      className="w-[350px]"
                      accept="image/*,application/pdf"
                      onChange={(file) => {
                        field.onChange(file.target.files);
                      }}
                    />

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <label>Observação</label>
                    <Input
                      type="text"
                      className="w-[350px]"
                      accept=".png"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />

                    <FormMessage className="text-xs" />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <label>Valor</label>
                    <Input
                      type="number"
                      className="w-[350px]"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />

                    <FormMessage className="text-xs" />
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.dispatchEvent(
                      new Event("submit", { bubbles: true }),
                    );
                  }
                }}
              >
                Lançar
              </Button>
              <DialogClose ref={closedRef} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};
