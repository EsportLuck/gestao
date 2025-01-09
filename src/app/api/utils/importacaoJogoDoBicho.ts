import { WorkSheet } from "xlsx";
import {
  createRegisterEstabelecimento,
  registerReportDataJogoDoBicho,
  createImportacao,
} from "@/app/api/v1/utils/create";

import { findEstabelecimentoInDB } from "@/app/api/v1/utils/find/findEstabelecimentoInDB";
import {
  IFormatterType,
  TOlitecCaratecPlanetaCell,
  TReportOptions,
} from "@/app/api/v1/types";
import { prisma } from "@/services/prisma";
import { ImportacaoController } from "@/app/api/controller/importacao.controller";

type TJogoDoBicho = Extract<
  TReportOptions,
  "olitec" | "caratec" | "planeta-cell"
>;

const validSites: TJogoDoBicho[] = ["olitec", "caratec", "planeta-cell"];

const processEstabelecimento = async (
  estabelecimento: TOlitecCaratecPlanetaCell,
  site: string,
  company: string,
  weekReference: string,
  estabelecimentoDB: {
    id: number;
    name: string;
    matrizId: number | null;
  }[],
  importacaoId: number,
) => {
  try {
    let estabelecimentoExist:
      | { id: number; name: string; matrizId: number | null }
      | undefined
      | null = estabelecimentoDB.find(
      (dado) => dado.name === estabelecimento.Ponto,
    );

    if (!estabelecimentoExist) {
      await createRegisterEstabelecimento(estabelecimento.Ponto, site, company);
      estabelecimentoExist = await findEstabelecimentoInDB(
        estabelecimento.Ponto,
      );
    }

    if (!estabelecimentoExist) return;
    await registerReportDataJogoDoBicho(
      estabelecimentoExist.id,
      new Date(weekReference),
      site,
      estabelecimento.Vendas,
      estabelecimento["Pgto."],
      estabelecimento.Líquido,
      importacaoId,
      estabelecimentoExist.matrizId,
    );
  } catch (error) {
    console.error("processEstabelecimento", error);
  }
};

export const importacaoJogoDoBicho = async (
  formaterType: IFormatterType,
  site: TJogoDoBicho,
  worksheet: WorkSheet,
  weekReference: string,
  company: string,
  user: string,
) => {
  if (!validSites.includes(site)) return;

  try {
    const estabelecimentos = formaterType[site](worksheet);

    const [_, estabelecimentoExist] = await Promise.all([
      createImportacao(user, weekReference, site),
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
          estabelecimento,
          site,
          company,
          weekReference,
          estabelecimentoExist,
          importacaoId?.id!,
        ),
      ),
    );
  } catch (error) {
    console.error("importacao Jogo do Bicho", error);
  }
};
