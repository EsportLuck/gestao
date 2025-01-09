import { Liquido } from "@prisma/client";

export interface ILiquidoService {
  findById(id: number): Promise<Liquido | null>;
  findManyByImportacaoId(
    id: number,
  ): Promise<{ liquido: Liquido[] | undefined; error: boolean } | undefined>;
  findAll(): Promise<Liquido[]>;
  create(liquido: Partial<Liquido>): Promise<void>;
  update(id: number, data: Partial<Liquido>): Promise<void>;
  deleteManyById(id: number[]): Promise<{ error: boolean }>;
}
