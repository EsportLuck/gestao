import { prisma } from "@/services/prisma";
import { Liquido } from "@prisma/client";
import { ILiquidoRepository } from "../contracts/Liquido";

export class LiquidoRepository implements ILiquidoRepository {
  async findManyByImportacaoId(id: number): Promise<Liquido[]> {
    return await prisma.liquido.findMany({
      where: {
        importacaoId: id,
      },
    });
  }
  async findById(id: number): Promise<Liquido | null> {
    return await prisma.liquido.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Liquido[]> {
    return await prisma.liquido.findMany();
  }

  async create(liquido: Liquido): Promise<void> {
    await prisma.liquido.create({
      data: liquido,
    });
  }

  async update(id: number, data: Partial<Liquido>): Promise<void> {
    await prisma.liquido.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteManyById(id: number[]): Promise<void> {
    await prisma.liquido.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  }
}
