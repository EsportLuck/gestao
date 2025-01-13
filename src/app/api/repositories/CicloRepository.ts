import { prisma } from "@/services/prisma";
import { ICicloRepository } from "@/app/api/contracts/ICicloRepository";
import { Ciclo, Prisma, PrismaClient } from "@prisma/client";

export class CicloRepository implements ICicloRepository {
  tx: Prisma.TransactionClient | PrismaClient;
  constructor(tx: Prisma.TransactionClient | PrismaClient = prisma) {
    this.tx = tx;
  }
  async criar(establishmentId: number, reference_date: Date): Promise<void> {
    await this.tx.ciclo.create({
      data: {
        reference_date,
        establishmentId,
      },
    });
  }

  async atualizar(cicloId: number, status: string): Promise<void> {
    await this.tx.ciclo.update({
      where: {
        id: cicloId,
      },
      data: {
        status,
      },
    });
  }

  async encontrarPorEstabelecimentoEData(
    establishmentId: number,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<Ciclo | null> {
    const gte = new Date(dataInicial.setHours(0, 0, 0, 0));
    const lte = new Date(dataFinal.setHours(23, 59, 59, 999));
    return await this.tx.ciclo.findFirst({
      where: {
        establishmentId,
        AND: {
          reference_date: {
            gte,
            lte,
          },
        },
      },
    });
  }
}
