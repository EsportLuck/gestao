import { Premios } from "@prisma/client";

export interface IPremiosRepository {
  findById(id: number): Promise<Premios | null>;
  findManyByImportacaoId(id: number): Promise<Premios[]>;
  findAll(): Promise<Premios[]>;
  create(premios: Premios): Promise<void>;
  update(id: number, data: Partial<Premios>): Promise<void>;
  deleteManyById(id: number[]): Promise<void>;
}
