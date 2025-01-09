import { prisma } from "@/services/prisma";
import { Caixa } from "@prisma/client";
import { ICaixaRepository } from "../contracts/Caixa";

export class CaixaRepository implements ICaixaRepository {
  async findById(id: number): Promise<Caixa | null> {
    return await prisma.caixa.findUnique({
      where: {
        id,
      },
    });
  }
  async findManyByImportacaoId(id: number): Promise<Caixa[]> {
    return await prisma.caixa.findMany({
      where: {
        importacaoId: id,
      },
    });
  }
  async findManyByGteDay(gte: Date): Promise<Caixa[]> {
    return await prisma.caixa.findMany({
      where: {
        referenceDate: {
          gte,
        },
      },
    });
  }
  async findLastCaixaByEstabelecimentoId(id: number): Promise<Caixa | null> {
    return await prisma.caixa.findFirst({
      where: {
        establishmentId: id,
      },
      orderBy: {
        referenceDate: "desc",
      },
    });
  }
  async findAll(): Promise<Caixa[]> {
    return await prisma.caixa.findMany();
  }
  async create(data: Caixa): Promise<void> {
    await prisma.caixa.create({
      data,
    });
  }
  async update(id: number, data: Partial<Caixa>): Promise<void> {
    await prisma.caixa.update({
      where: {
        id,
      },
      data,
    });
  }
}
