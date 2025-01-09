import { prisma } from "@/services/prisma";

export const createRegisterPremios = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  prize: number,
  importacaoId: number,
) => {
  if (
    !estabelecimento ||
    !weekReference ||
    !site ||
    typeof prize !== "number" ||
    !importacaoId
  ) {
    throw new Error("Some data is missing in createRegisterPremios");
  }
  const value = Number((prize * 100).toFixed(0));
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
    console.error("create createRegisterPrêmios", error);
  }
};
