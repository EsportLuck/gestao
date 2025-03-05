"use client";
import {
  Button,
  ErrorMessageInput,
  Input,
  Label,
  useToast,
} from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { ErrorHandlerAdapter } from "@/presentation/adapters";

const formSchema = z.object({
  nome: z
    .string({
      required_error: "Escolha uma nome",
    })
    .regex(/^[A-Za-z]{3,}.*$/, {
      message: "A empresa deve conter pelo menos 3 letras",
    }),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const { toast } = useToast();
  const { handleSubmit, formState, control } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const fetch = new FetchHttpClient();

      const { data: fechData } = await fetch.post<{
        status: number;
        message?: string;
      }>(`/api/v1/management/empresa/criar`, {
        nome: data.nome,
      });
      if (fechData.status !== 200) throw new Error(fechData.message);
      toast({
        title: `Empresa criada com sucesso!`,
        variant: "success",
      });
    } catch (error) {
      const errorAdapter = new ErrorHandlerAdapter();
      return errorAdapter.handle(error);
    }
  };
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold">Crie a Empresa</h2>
      <p className="text-sm text-muted-foreground">
        Preencha o campo a baixo como no exemplo
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid mt-6 max-w-60 ">
        <div>
          <Controller
            control={control}
            name="nome"
            render={({ field }) => (
              <>
                <Label>Nome</Label>
                <Input
                  id="name"
                  onChange={field.onChange}
                  placeholder={`Nome da Empresa`}
                />
              </>
            )}
          />
          <ErrorMessageInput error={formState.errors} name={"nome"} />
        </div>
        <div></div>
        <Button type="submit" disabled={formState.isSubmitting}>
          Criar
        </Button>
      </form>
    </div>
  );
}
