import { prisma } from "@/services/prisma";
import { Comissao } from "@prisma/client";
import { IComissaoRepository } from "../contracts/Comissao";

export class ComissaoRepository implements IComissaoRepository {
  async findById(id: number): Promise<Comissao | null> {
    return await prisma.comissao.findUnique({
      where: {
        id,
      },
    });
  }
  async findManyByImportacaoId(id: number): Promise<Comissao[]> {
    return await prisma.comissao.findMany({
      where: {
        importacaoId: id,
      },
    });
  }
  async findAll(): Promise<Comissao[]> {
    return await prisma.comissao.findMany();
  }
  async create(comissao: Comissao): Promise<void> {
    await prisma.comissao.create({
      data: comissao,
    });
  }
  async update(id: number, data: Partial<Comissao>): Promise<void> {
    await prisma.comissao.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteManyById(id: number[]): Promise<void> {
    await prisma.comissao.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  }
}
