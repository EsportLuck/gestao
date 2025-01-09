import { prisma } from "@/services/prisma";

export const createRegisterNet = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  liquido: number,
  importacaoId: number,
) => {
  if (!estabelecimento || !weekReference || !site || !importacaoId)
    throw new Error("Some data is missing in createRegisterNet");
  const value = Number((liquido * 100).toFixed(0));
  try {
    await prisma.liquido.create({
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
