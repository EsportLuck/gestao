import { Comissao } from "@prisma/client";

export interface IComissaoService {
  findById(id: number): Promise<Comissao | null>;
  findManyByImportacaoId(
    id: number,
  ): Promise<{ comissao: Comissao[] | undefined; error: boolean }>;
  findAll(): Promise<Comissao[]>;
  create(comissao: Partial<Comissao>): Promise<void>;
  update(id: number, data: Partial<Comissao>): Promise<void>;
  deleteManyById(id: number[]): Promise<{ error: boolean }>;
}
