import { prisma } from "@/services/prisma";

export const findImportacaoInDB = async (
  weekReference: string,
  site: string,
) => {
  try {
    return await prisma.importacao.findFirst({
      where: {
        referenceDate: new Date(weekReference),
        relatorio: site,
        AND: {
          state: {
            equals: "Importado",
          },
        },
      },
    });
  } catch (error) {
    console.error("find findImportacaoInDB findImportacaoInDB", error);
  }
};
