import { prisma } from "@/services/prisma";
import { COMMISSION_AMOUNT } from "../VARIABLES";
import { Prisma } from "@prisma/client";

export const createRegisterCommissionJogoDoBicho = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  comissão: number,
  importacaoId: number,
  tx: Prisma.TransactionClient,
) => {
  if (!estabelecimento || !weekReference || !site || !importacaoId)
    throw new Error(
      "Some data is missing in createRegisterCommissionJogoDoBicho",
    );
  try {
    const value = Number((comissão * COMMISSION_AMOUNT * 100).toFixed(0));
    await tx.comissao.create({
      data: {
        value,
        referenceDate: new Date(weekReference),
        site,
        establishment: {
          connect: { id: estabelecimento },
        },
        importacao: {
          connect: {
            id: importacaoId,
          },
        },
      },
    });
  } catch (error) {
    console.error("create createRegisterCommissionJogoDoBicho", error);
  }
};
