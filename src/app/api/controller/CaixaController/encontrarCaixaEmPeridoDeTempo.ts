import { prisma } from "@/services/prisma";

export async function encontrarCaixaEmPeridoDeTempo(
  establishmentId: number,
  maiorQue: Date,
  menorQue: Date,
) {
  const gte = new Date(new Date(maiorQue).setUTCHours(0, 0, 0, 0));
  const lte = new Date(new Date(menorQue).setUTCHours(23, 59, 59, 0));

  return prisma.caixa.findMany({
    where: {
      referenceDate: {
        gte,
        lte,
      },
      AND: {
        establishmentId,
      },
    },
  });
}
