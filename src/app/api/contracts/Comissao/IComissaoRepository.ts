import { Comissao } from "@prisma/client";

export interface IComissaoRepository {
  findById(id: number): Promise<Comissao | null>;
  findManyByImportacaoId(id: number): Promise<Comissao[]>;
  findAll(): Promise<Comissao[]>;
  create(comissao: Partial<Comissao>): Promise<void>;
  update(id: number, data: Partial<Comissao>): Promise<void>;
  deleteManyById(id: number[]): Promise<void>;
}
