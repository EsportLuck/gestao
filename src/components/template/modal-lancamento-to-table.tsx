"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  ErrorMessageInput,
  toast,
} from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TEstabelecimento } from "@/types/estabelecimento";
import axios from "axios";
import { useSession } from "next-auth/react";
import { estabelecimentosStorage } from "@/utils/estabelecimentosStorage";

const FormSchema = z.object({
  tipo: z.string({ required_error: "Escolha um tipo" }),
  forma_pagamento: z.string({ required_error: "Escolha uma forma" }),
  estabelecimento: z.string({ required_error: "Escolha um estabelecimento" }),
  comprovante: z.any({ required_error: "Adicione um comprovante" }),
  valor: z.string({ required_error: "Adicione um valor" }).min(0.01),
  observacao: z.string({ required_error: "Adicione uma observacao" }),
});
type TFormSchema = z.infer<typeof FormSchema>;
export const ModalLancamentoToTable: FC<{
  estabelecimento: { id: string; name: string };
}> = ({ estabelecimento }) => {
  const [estabelecimentos, setEstabelecimentos] = useState<
    Partial<TEstabelecimento[]>
  >([]);
  const { data: session } = useSession();

  const formRef = useRef<HTMLFormElement | null>(null);
  const closedRef = useRef<HTMLButtonElement | null>(null);
  const { handleSubmit, formState, reset, control } = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
  });
  const { isSubmitting, errors } = formState;
  useEffect(() => {
    if (estabelecimentos.length > 0) return;
    (async () => {
      const estabelecimentos = await estabelecimentosStorage();
      setEstabelecimentos(estabelecimentos);
    })();
  }, [estabelecimentos]);
  async function formSubmit(data: TFormSchema) {
    let closed = closedRef.current;
    closed?.click();
    const formData = new FormData();
    const date = new Date();
    formData.append("tipo", data.tipo);
    formData.append("forma_pagamento", data.forma_pagamento);
    formData.append("estabelecimentoId", data.estabelecimento);
    formData.append("comprovante", data.comprovante);
    formData.append("valor", data.valor);
    formData.append("observacao_comprovante", data.observacao);
    formData.append("user", session?.user.username as string);
    formData.append("date_reference", date.toString());
    try {
      const response = await axios.post("/api/v1/entering/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const sucess = {
        file: response.statusText,
      };
      reset();
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(sucess, null, 2)}
            </code>
          </pre>
        ),
        variant: "success",
      });
      reset();
    } catch (error) {
      toast({
        description: (
          <pre className="rounded-md bg-red-600 p-4">
            <code className="text-white text-wrap">
              Verifique se você preencheu as informações de maneira correta
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } finally {
      reset();
    }
  }
  return (
    <form
      className="grid gap-4 py-4"
      onSubmit={handleSubmit(formSubmit)}
      ref={formRef}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="max-w-[425px]">
            Criar novo lançamento
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lancamento</DialogTitle>
            <DialogDescription>
              Crie lancamento para os estabelecimentos
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Tipo de lançamento</label>
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
                        <SelectItem value="pagamento">Pagamento</SelectItem>
                        <SelectItem value="recebimento">Recebimento</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors["tipo"] && (
                    <ErrorMessageInput error={errors} name={"tipo"} />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
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
                  {errors["forma_pagamento"] && (
                    <ErrorMessageInput
                      error={errors}
                      name={"forma_pagamento"}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
              name="estabelecimento"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Escolha um estabelecimento</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Estabelecimentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          key={estabelecimento.name}
                          value={estabelecimento.id.toString()}
                        >
                          {estabelecimento.name}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors["estabelecimento"] && (
                    <ErrorMessageInput
                      error={errors}
                      name={"estabelecimento"}
                    />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
              name="comprovante"
              render={({ field }) => (
                <div className="grid gap-2">
                  <label>Selecione o comprovante</label>
                  <Input
                    type="file"
                    className="w-[350px]"
                    accept=".png"
                    onChange={(data) => {
                      const image = data.target.files![0];

                      field.onChange(image);
                    }}
                    defaultValue={field.value}
                  />

                  {errors["comprovante"] && (
                    <ErrorMessageInput error={errors} name={"comprovante"} />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
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

                  {errors["valor"] && (
                    <ErrorMessageInput error={errors} name={"valor"} />
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Controller
              control={control}
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

                  {errors["observacao"] && (
                    <ErrorMessageInput error={errors} name={"observacao"} />
                  )}
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
  );
};
