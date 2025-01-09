import { Liquido } from "@prisma/client";

export interface ILiquidoRepository {
  findById(id: number): Promise<Liquido | null>;
  findManyByImportacaoId(id: number): Promise<Liquido[]>;
  findAll(): Promise<Liquido[]>;
  create(liquido: Partial<Liquido>): Promise<void>;
  update(id: number, data: Partial<Liquido>): Promise<void>;
  deleteManyById(id: number[]): Promise<void>;
}
