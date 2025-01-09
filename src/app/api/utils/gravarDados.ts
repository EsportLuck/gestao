import { prisma } from "@/services/prisma";
import { TReportAtena } from "../v1/types";
import {
  createRegisterEstabelecimento,
  registerReportFutebol,
} from "../v1/utils/create";
import { findEstabelecimentoInDB } from "../v1/utils/find";

export async function gravarDados(
  estabelimentos: TReportAtena[],
  site: string,
  company: string,
  weekReference: Date,
  importacaoId: number,
  todasAsSecoes: {
    id: number;
    name: string;
  }[],
  todasAsLocalidades: {
    id: number;
    name: string;
  }[],
  estabelecimentoExist: {
    id: number;
    name: string;
    matrizId: number | null;
  }[],
) {
  return estabelimentos.map(async (estabelecimento) => {
    try {
      await processEstabelecimento(
        estabelecimento,
        site,
        company,
        weekReference,
        estabelecimentoExist,
        todasAsLocalidades,
        todasAsSecoes,
        importacaoId,
      );
    } catch (error) {
      console.error("create createRegisterCashierFutebol", error);
    }
  });
}

const processEstabelecimento = async (
  report: TReportAtena,
  site: string,
  company: string,
  weekReference: Date,
  estabelecimentoDB: {
    id: number;
    name: string;
    matrizId: number | null;
  }[],
  localidadeDB: {
    id: number;
    name: string;
  }[],
  secaoDB: {
    id: number;
    name: string;
  }[],
  importacaoId: number,
) => {
  let secaoExist: { name: string; id: number } | undefined | null =
    secaoDB.find((dado) => dado?.name === report.Seção);
  let localidadeExist: { name: string; id: number } | undefined | null =
    localidadeDB.find((dado) => dado?.name === report.Localidade);
  let estabelecimentoExist:
    | { id: number; name: string; matrizId: number | null }
    | undefined
    | null = estabelecimentoDB.find(
    (dado) => dado.name === report.Estabelecimento,
  );
  await prisma.$transaction(async () => {
    try {
      if (!estabelecimentoExist) {
        await createRegisterEstabelecimento(
          report.Estabelecimento,
          site,
          company,
          localidadeExist?.id,
          secaoExist?.id,
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
        importacaoId,
        estabelecimentoExist.matrizId,
      );
    } catch (error) {
      console.error("create createRegisterCashierFutebol", error);
    }
  });
};
