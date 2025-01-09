import {
  createRegisterEstabelecimento,
  registerReportFutebol,
} from "@/app/api/v1/utils/create";
import { findEstabelecimentoInDB } from "@/app/api/v1/utils/find";
import { IFormattedReportSportNet } from "@/app/api/v1/types";

import { FormatterFunctions } from "../v1/utils/strategy";
import { EstabelecimentoSelecionado } from "../contracts";

const processEstabelecimento = async (
  report: IFormattedReportSportNet,
  site: string,
  company: string,
  weekReference: Date,
  estabelecimentoDB: EstabelecimentoSelecionado[] | null | undefined,
  importId: number,
) => {
  try {
    let estabelecimentoExist: any;
    estabelecimentoExist = estabelecimentoDB
      ? estabelecimentoDB.find((dado) => dado.name === report.Estabelecimento)
      : [];

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
      new Date(weekReference),
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
    console.error("processEstabelecimento", error);
  }
};

export const importacaoFutebolVip = async (
  file: IFormattedReportSportNet[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  importacaoId: number,
  estabelecimentoExist?: EstabelecimentoSelecionado[] | null,
) => {
  try {
    const estabelecimentos = file;

    await Promise.all(
      estabelecimentos.map((estabelecimento) =>
        processEstabelecimento(
          estabelecimento as IFormattedReportSportNet,
          site,
          company,
          weekReference,
          estabelecimentoExist,
          importacaoId,
        ),
      ),
    );
  } catch (error) {
    console.error("importacao FutebolVip", error);
  }
};
