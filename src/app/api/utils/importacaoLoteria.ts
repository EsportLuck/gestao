import { WorkSheet } from "xlsx";

import {
  createRegisterEstabelecimento,
  createLocalidade,
  createImportacao,
  registerReportLoteria,
} from "@/app/api/v1/utils/create";
import {
  findEstabelecimentoInDB,
  findLocalidadeInDB,
} from "@/app/api/v1/utils/find";
import { TReportFratec, IFormatterType } from "@/app/api/v1/types";
import { prisma } from "@/services/prisma";
import { ImportacaoController } from "@/app/api/controller/importacao.controller";

const processEstabelecimento = async (
  report: TReportFratec,
  site: "fratec",
  weekReference: string,
  company: string,
  estabelecimentoDB: {
    id: number;
    name: string;
    matrizId: number | null;
  }[],
  localidadeDB: {
    id: number;
    name: string;
  }[],
  importedId: number,
) => {
  try {
    let localidadeExist: { name: string; id: number } | undefined | null =
      localidadeDB.find((dado) => dado.name === report.Localidade);
    let estabelecimentoExist:
      | { id: number; name: string; matrizId: number | null }
      | undefined
      | null = estabelecimentoDB.find((dado) => dado.name === report.Nome);

    if (!localidadeExist) {
      await createLocalidade(report.Localidade);
      localidadeExist = await findLocalidadeInDB(report.Localidade);
    }

    if (!localidadeExist) return;

    if (!estabelecimentoExist) {
      await createRegisterEstabelecimento(
        report.Nome,
        site,
        company,
        localidadeExist.id,
      );
      estabelecimentoExist = await findEstabelecimentoInDB(report.Nome);
    }

    if (!estabelecimentoExist) return;

    await registerReportLoteria(
      estabelecimentoExist.id,
      new Date(weekReference),
      site,
      report.Vendas,
      report.Comissão,
      report["Prêmios Pagos"],
      report.Líquido,
      importedId,
      estabelecimentoExist.matrizId,
    );
  } catch (error) {
    console.error("processEstabelecimento loteria", error);
  }
};

export const importacaoLoteria = async (
  formaterType: IFormatterType,
  site: "fratec",
  worksheet: WorkSheet,
  weekReference: string,
  company: string,
  user: string,
) => {
  if (site !== "fratec") return;

  try {
    const estabelecimentos = formaterType[site](worksheet);

    const [_, estabelecimentoExist, localidadeExist] = await Promise.all([
      createImportacao(user, weekReference, site),
      prisma.estabelecimento.findMany({
        select: {
          id: true,
          name: true,
          matrizId: true,
        },
      }),
      prisma.localidade.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);
    const importacaoId =
      await new ImportacaoController().findAndSelectIdWithDateAndReport(
        new Date(weekReference),
        site,
      );

    await Promise.all(
      estabelecimentos.map((estabelecimento) =>
        processEstabelecimento(
          estabelecimento,
          site,
          weekReference,
          company,
          estabelecimentoExist,
          localidadeExist,
          importacaoId?.id!,
        ),
      ),
    );
  } catch (error) {
    console.error("importacao Loteria", error);
  }
};
