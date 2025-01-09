import { Vendas } from "@prisma/client";

export interface IVendasService {
  findById(id: number): Promise<Vendas | null>;
  findManyByImportacaoId(
    id: number,
  ): Promise<{ vendas: Vendas[] | undefined; error: boolean }>;
  findAll(): Promise<Vendas[]>;
  create(vendas: Partial<Vendas>): Promise<void>;
  update(id: number, data: Partial<Vendas>): Promise<void>;
  deleteManyById(id: number[]): Promise<{ error: boolean }>;
}
