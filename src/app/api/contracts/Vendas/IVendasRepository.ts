import { Vendas } from "@prisma/client";

export interface IVendasRepository {
  findById(id: number): Promise<Vendas | null>;
  findManyByImportacaoId(id: number): Promise<Vendas[]>;
  findAll(): Promise<Vendas[]>;
  create(vendas: Partial<Vendas>): Promise<void>;
  update(id: number, data: Partial<Vendas>): Promise<void>;
  deleteManyById(id: number[]): Promise<void>;
}
