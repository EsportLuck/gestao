import { Premios } from "@prisma/client";

export interface IPremiosService {
  findById(id: number): Promise<Premios | null>;
  findManyByImportacaoId(
    id: number,
  ): Promise<{ premios: Premios[] | undefined; error: boolean }>;
  findAll(): Promise<Premios[]>;
  create(data: Partial<Premios>): Promise<void>;
  update(id: number, data: Partial<Premios>): Promise<void>;
  deleteManyById(id: number[]): Promise<{ error: boolean }>;
}
