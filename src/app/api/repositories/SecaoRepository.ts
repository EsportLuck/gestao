import { prisma } from "@/services/prisma";

import { Secao } from "@prisma/client";
import { ISecaoRepository } from "../contracts/Secao";

export class SecaoRepository implements ISecaoRepository {
  async obterTodas() {
    return await prisma.secao.findMany();
  }

  async obterPorId(id: number): Promise<Secao | null> {
    return await prisma.secao.findUnique({
      where: {
        id,
      },
    });
  }

  async criar(name: string, empresa: number | undefined): Promise<any> {
    return await prisma.secao.create({
      data: {
        name: name,
        empresaId: empresa,
      },
    });
  }

  async atualizar(id: number, name: string): Promise<any> {
    return await prisma.secao.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });
  }

  async apagar(id: number): Promise<any> {
    return await prisma.secao.delete({
      where: {
        id,
      },
    });
  }

  async obterPorNome(nome: string): Promise<Secao | null> {
    return await prisma.secao.findUnique({
      where: {
        name: nome,
      },
    });
  }
  async encontrarTodasAsSecoesPorEmpresa(name: string): Promise<Secao[]> {
    return prisma.secao.findMany({
      where: {
        empresa: {
          name,
        },
      },
    });
  }
}
