import { prisma } from "@/services/prisma";
import { Importacao } from "@prisma/client";
export class ImportacaoController {
  async findWithId({ id }: Partial<Importacao>) {
    return await prisma.importacao.findFirst({
      where: { id },
    });
  }

  async findAndSelectIdWithDateAndReport(
    referenceDate: Date,
    relatorio: string,
  ) {
    return await prisma.importacao.findFirst({
      where: { referenceDate, relatorio },
      select: {
        id: true,
      },
    });
  }
}
