import { prisma } from "@/services/prisma";
import { Prisma } from "@prisma/client";

export const createRegisterNet = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  liquido: number,
  importacaoId: number,
  tx: Prisma.TransactionClient,
) => {
  if (!estabelecimento || !weekReference || !site || !importacaoId)
    throw new Error("Some data is missing in createRegisterNet");
  const value = Number((liquido * 100).toFixed(0));
  try {
    await tx.liquido.create({
      data: {
        value,
        referenceDate: new Date(weekReference),
        site,
        establishment: {
          connect: { id: estabelecimento },
        },
        importacao: {
          connect: { id: importacaoId },
        },
      },
    });
  } catch (error) {
    console.error("createRegisterNet", error);
  }
};
