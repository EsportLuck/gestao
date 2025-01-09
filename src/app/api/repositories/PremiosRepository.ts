import { prisma } from "@/services/prisma";
import { Premios } from "@prisma/client";
import { IPremiosRepository } from "../contracts/Premios";

export class PremiosRepository implements IPremiosRepository {
  async findById(id: number): Promise<Premios | null> {
    return await prisma.premios.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findManyByImportacaoId(id: number): Promise<Premios[]> {
    return await prisma.premios.findMany({
      where: {
        importacaoId: id,
      },
    });
  }

  async findAll(): Promise<Premios[]> {
    return await prisma.premios.findMany();
  }

  async create(premios: Premios): Promise<void> {
    await prisma.premios.create({
      data: premios,
    });
  }

  async update(id: number, data: Partial<Premios>): Promise<void> {
    await prisma.premios.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
  async deleteManyById(id: number[]): Promise<void> {
    await prisma.premios.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  }
}
