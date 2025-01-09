import { prisma } from "@/services/prisma";

export const createRegisterSales = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  vendas: number,
  quantidade: number | 0,
  importacaoId: number,
) => {
  if (!estabelecimento || !weekReference || !site || !importacaoId)
    throw new Error("Some data is missing in createRegisterSales");
  const value = Number((vendas * 100).toFixed(0));
  try {
    await prisma.vendas.create({
      data: {
        value,
        referenceDate: new Date(weekReference),
        site,
        establishment: {
          connect: { id: estabelecimento },
        },
        quantity: quantidade || 0,
        importacao: {
          connect: { id: importacaoId },
        },
      },
    });
  } catch (error) {
    console.error("create createRegisterSales createRegisterSales", error);
  }
};
