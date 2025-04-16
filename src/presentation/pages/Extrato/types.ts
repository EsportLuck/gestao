import { z } from "zod";

export const formSchema = z.object({
  dataInicial: z.date({ required_error: "Escolha uma data" }),
  dataFinal: z.date({ required_error: "Escolha uma data" }),
  localidade: z.string().optional(),
  secao: z.string().optional(),
  rota: z.string().optional(),
  supervisor: z.string().optional(),
  estabelecimento: z.string().optional(),
  empresa: z.string().optional(),
});

export type TFormSchema = z.infer<typeof formSchema>;
export type TFormExtrato = {};

export interface TotalValueItem {
  label: string;
  value: string | number;
}