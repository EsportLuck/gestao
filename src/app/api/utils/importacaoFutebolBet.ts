import { WorkSheet } from "xlsx";

import {
  createImportacao,
  createRegisterEstabelecimento,
  registerReportFutebol,
} from "@/app/api/v1/utils/create";
import { findEstabelecimentoInDB } from "@/app/api/v1/utils/find";
import {
  IFormatterType,
  IFormattedReportSportNet,
  TReportEsportNet,
} from "@/app/api/v1/types";
import { formatterMap } from "@/app/api/v1/utils/strategy";
import { prisma } from "@/services/prisma";
import { ImportacaoController } from "@/app/api/controller/importacao.controller";

const processEstabelecimento = async (
  report: IFormattedReportSportNet,
  site: string,
  company: string,
  weekReference: Date,
  estabelecimentoDB: {
    id: number;
    name: string;
    matrizId: number | null;
  }[],
  importId: number,
) => {
  try {
    let estabelecimentoExist:
      | { id: number; name: string; matrizId: number | null }
      | undefined
      | null = estabelecimentoDB.find(
      (dado) => dado.name === report.Estabelecimento,
    );
    if (!estabelecimentoExist) {
      await createRegisterEstabelecimento(
        report.Estabelecimento,
        site,
        company,
      );
      estabelecimentoExist = await findEstabelecimentoInDB(
        report.Estabelecimento,
      );
    }

    if (!estabelecimentoExist) return;

    await registerReportFutebol(
      estabelecimentoExist.id,
      weekReference,
      site,
      report.Vendas,
      report.Quantidade,
      report["Comissão"],
      report["Prêmios/Saques"],
      report.Líquido,
      importId,
      estabelecimentoExist.matrizId,
    );
  } catch (error) {
    console.error("process Establishmento", error);
  }
};

export const importacaoFutebolBet = async (
  formaterType: IFormatterType,
  site: TReportEsportNet,
  worksheet: WorkSheet,
  weekReference: Date,
  company: string,
  user: string,
) => {
  if (formatterMap[site]) {
    console.error(`Site ${site} is not included in ReportBet`);
    return;
  }

  try {
    const estabelecimentos = formaterType[site](worksheet);

    const [_, estabelecimentoExist] = await Promise.all([
      createImportacao(user, weekReference.toString(), site),
      prisma.estabelecimento.findMany({
        select: {
          id: true,
          name: true,
          matrizId: true,
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
          estabelecimento as IFormattedReportSportNet,
          site,
          company,
          weekReference,
          estabelecimentoExist,
          importacaoId?.id!,
        ),
      ),
    );
  } catch (error) {
    console.error("importacao FutebolBet", error);
  }
};
