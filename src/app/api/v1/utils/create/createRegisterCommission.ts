import { prisma } from "@/services/prisma";

export const createRegisterCommission = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  comissão: number,
  importacaoId: number,
) => {
  if (!estabelecimento || !weekReference || !site || !importacaoId)
    throw new Error("Some data is missing in createRegisterCommission");
  const value = Number((comissão * 100).toFixed(0));
  try {
    await prisma.comissao.create({
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
    console.error("create createRegisterCommission", error);
  }
};
