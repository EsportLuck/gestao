import { prisma } from "@/services/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

export async function atualizarCaixa(
  id: number | undefined,
  total: number,
  value_search: string,
  searchTotal: number,
  tx: Prisma.TransactionClient | PrismaClient,
) {
  if (id === undefined) return null;

  await tx.caixa.update({
    where: { id },
    data: {
      total,
      [value_search]: searchTotal,
    },
  });
}
