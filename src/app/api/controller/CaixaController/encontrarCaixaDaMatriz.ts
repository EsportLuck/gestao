import { prisma } from "@/services/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

interface IEncontrarCaixaDaMatriz {
  id: number | null;
  gte: Date;
  lte: Date;
  value_search: any;
  tx: Prisma.TransactionClient | PrismaClient;
}

export async function encontrarCaixaDaMatriz({
  id,
  gte,
  lte,
  value_search,
  tx,
}: IEncontrarCaixaDaMatriz): Promise<{
  id: number;
  total: number;
  [key: string]: any;
} | null> {
  try {
    return await tx.caixa.findFirst({
      where: {
        establishmentId: {
          equals: id as number,
        },
        AND: {
          referenceDate: gte,
        },
      },
      select: {
        id: true,
        total: true,
        [value_search]: true,
      },
    });
  } catch (error) {
    return null;
    console.error("encontrarCaixaDaMatriz", error);
  }
}
