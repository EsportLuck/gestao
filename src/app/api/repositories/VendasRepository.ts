import { prisma } from "@/services/prisma";
import { Vendas } from "@prisma/client";
import { IVendasRepository } from "../contracts/Vendas";

export class VendasRepository implements IVendasRepository {
  async findById(id: number): Promise<Vendas | null> {
    return await prisma.vendas.findUnique({
      where: {
        id,
      },
    });
  }
  async findManyByImportacaoId(id: number): Promise<Vendas[]> {
    return await prisma.vendas.findMany({
      where: {
        importacaoId: id,
      },
    });
  }
  async findAll(): Promise<Vendas[]> {
    return await prisma.vendas.findMany();
  }
  async create(vendas: Vendas): Promise<void> {
    await prisma.vendas.create({
      data: vendas,
    });
  }
  async update(id: number, data: Partial<Vendas>): Promise<void> {
    await prisma.vendas.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteManyById(id: number[]) {
    await prisma.vendas.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  }
}
