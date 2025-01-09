import { ICronJobCriarCaixaDiarioRepository } from "../contracts";
import { prisma } from "@/services/prisma";
export class CronJobCriarCaixaDiarioRepository
  implements ICronJobCriarCaixaDiarioRepository
{
  async verificarUltimaExecucao(): Promise<{
    id: number | null;
    date: Date | null;
  } | null> {
    return await prisma.cronjob.findFirst({
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
      },
    });
  }

  async criarCronjob(name: string, date: Date = new Date()): Promise<void> {
    await prisma.cronjob.create({
      data: {
        name,
        date,
      },
    });
  }

  async encontrarPorNomeEData(
    name: string,
    date: Date,
  ): Promise<{ id: number | null } | null> {
    return await prisma.cronjob.findFirst({
      where: {
        name: {
          equals: name,
        },
        AND: {
          date: {
            equals: date,
          },
        },
      },
    });
  }
}
