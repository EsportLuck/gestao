import { Caixa } from "@prisma/client";

export interface ICaixaService {
  findById(id: number): Promise<Caixa | null>;
  findManyByImportacaoId(
    id: number,
  ): Promise<{ caixa: Caixa[] | undefined; error: boolean }>;
  findManyByGteDay(
    gte: Date,
  ): Promise<{ caixa: Partial<Caixa[]> | undefined; error: boolean }>;
  findLastCaixaByEstabelecimentoId(
    id: number,
  ): Promise<
    { caixa: Caixa; error: false } | { caixa: undefined; error: true }
  >;
  findAll(): Promise<Caixa[]>;
  create(caixa: Partial<Caixa>): Promise<void>;
  update(id: number, data: Partial<Caixa>): Promise<void>;
}
