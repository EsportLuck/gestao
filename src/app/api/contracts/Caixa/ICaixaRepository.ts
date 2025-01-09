import { Caixa } from "@prisma/client";

export interface ICaixaRepository {
  findById(id: number): Promise<Caixa | null>;
  findManyByImportacaoId(id: number): Promise<Caixa[]>;
  findManyByGteDay(gte: Date): Promise<Caixa[]>;
  findLastCaixaByEstabelecimentoId(id: number): Promise<Caixa | null>;
  findAll(): Promise<Caixa[]>;
  create(caixa: Partial<Caixa>): Promise<void>;
  update(id: number, data: Partial<Caixa>): Promise<void>;
}
