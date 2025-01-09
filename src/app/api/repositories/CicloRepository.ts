import { prisma } from "@/services/prisma";
import { ICicloRepository } from "@/app/api/contracts/ICicloRepository";
import { Ciclo } from "@prisma/client";

export class CicloRepository implements ICicloRepository {
  async criar(establishmentId: number, reference_date: Date): Promise<void> {
    await prisma.ciclo.create({
      data: {
        reference_date,
        establishmentId,
      },
    });
  }

  async atualizar(cicloId: number, status: string): Promise<void> {
    await prisma.ciclo.update({
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
    return await prisma.ciclo.findFirst({
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
