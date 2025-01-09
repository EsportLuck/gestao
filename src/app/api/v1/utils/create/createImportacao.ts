import { prisma } from "@/services/prisma";
import { findImportacaoInDB } from "../find";

export const createImportacao = async (
  username: string | undefined,
  dateReference: string,
  report: string,
) => {
  try {
    if (!username) return undefined;
    const importação = await findImportacaoInDB(dateReference, report);
    if (importação) return null;
    await prisma.importacao.create({
      data: {
        name: username,
        referenceDate: new Date(dateReference),
        state: "Importado",
        relatorio: report,
      },
    });
  } catch (error) {
    console.error("create createimportacao", error);
  }
};
