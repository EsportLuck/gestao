import { WorkSheet } from "xlsx";

import { createImportacao } from "@/app/api/v1/utils/create";
import { IFormatterType } from "@/app/api/v1/types";
import { prisma } from "@/services/prisma";
import { ImportacaoController } from "@/app/api/controller/importacao.controller";
import { LocalidadeService, SecaoService } from "@/app/api/services";
import { LocalidadeRepository, SecaoRepository } from "@/app/api/repositories";
import { gravarDados } from "./gravarDados";
import { obterTodasLocalidadesESecoes } from "../v1/(routes)/import/utils/obterTodasLocalidadesESecoes";

type TSite =
  | "1738 - banca luck"
  | "2300 - arena sport luck"
  | "4700 - rv luck"
  | "5635 - sport luck"
  | "6147 - neri pernambuco"
  | "6347 - unialagoas"
  | "6648 - andre carioca"
  | "6649 - roge saco"
  | "6803 - bruno sport luck"
  | "6651 - wagner prata";

export const metodoDeSalvarFutebolArenaNoBancoDeDados = async (
  formaterType: IFormatterType,
  site: TSite,
  worksheet: WorkSheet,
  weekReference: string,
  company: string,
  user: string,
) => {
  try {
    const estabelecimentos = formaterType[site](worksheet);
    await createImportacao(user, weekReference, site);
    const [estabelecimentoExist, localidadeExist, secaoExist] =
      await prisma.$transaction([
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
        prisma.secao.findMany({
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

    const secaoService = new SecaoService(new SecaoRepository());
    const localidadeService = new LocalidadeService(new LocalidadeRepository());

    const todasSecoesComSecaoRepetidas = estabelecimentos.map(
      (estabelecimento) => estabelecimento.Seção,
    );
    const todasLocaldiadesComLocalidadesRepetidas = estabelecimentos.map(
      (estabelecimento) => estabelecimento.Localidade,
    );
    const secaoUnicas = [...new Set(todasSecoesComSecaoRepetidas)];
    const localidadesUnicas = [
      ...new Set(todasLocaldiadesComLocalidadesRepetidas),
    ];

    for (const secaoUnica of secaoUnicas) {
      if (!secaoExist.find((secao) => secao.name === secaoUnica)) {
        await secaoService.criar(secaoUnica, company);
      }
    }

    for (const localidadeUnica of localidadesUnicas) {
      if (
        !localidadeExist.find(
          (localidade) => localidade.name === localidadeUnica,
        )
      ) {
        await localidadeService.criar(localidadeUnica, company);
      }
    }

    const { todasSecoes, todasLocalidades } =
      await obterTodasLocalidadesESecoes();

    await gravarDados(
      estabelecimentos,
      site,
      company,
      new Date(weekReference),
      importacaoId?.id!,
      todasSecoes,
      todasLocalidades,
      estabelecimentoExist,
    );
  } catch (error) {
    console.error("importacao futebol arena", error);
  }
};
