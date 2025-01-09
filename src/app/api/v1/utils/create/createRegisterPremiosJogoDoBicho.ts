import { prisma } from "@/services/prisma";
import { COMMISSION_AMOUNT } from "@/app/api/v1/utils/VARIABLES";

export const createRegisterPremiosJogoDoBicho = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  paidOut: number,
  sales: number,
  importacaoId: number,
) => {
  if (!estabelecimento || !weekReference || !site)
    throw new Error("Some data is missing in createRegisterPremiosJogoDoBicho");
  const value = Number(
    ((paidOut - sales * COMMISSION_AMOUNT) * 100).toFixed(0),
  );
  try {
    await prisma.premios.create({
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
    console.error(
      "create createRegiserPremiosJogoDoBicho createRegisterPremiosJogoDoBicho",
      error,
    );
  }
};
