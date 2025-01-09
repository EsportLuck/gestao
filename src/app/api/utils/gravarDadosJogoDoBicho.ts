import { Localidade, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { EstabelecimentoService } from "@/app/api/services";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";
import { EstabelecimentoRepository } from "@/app/api/repositories";
import { prisma } from "@/services/prisma";
import { registerReportDataJogoDoBicho } from "../v1/utils/create";

export const gravarDadosJogoDoBicho = async (
  file: TOlitecCaratecPlanetaCell[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  _localidadesNoBanco: Localidade[] | null,
  _secaoNoBanco: Secao[] | null,
  importacaoId: number,
): Promise<
  | { success: true; message: "Importado com sucesso" }
  | { success: false; message: string }
> => {
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );

  const results = [];
  for await (const dadosDosEstabelecimentos of file) {
    if (
      !estabelecimentosNoBanco?.find(
        (estabelecimentoDoBanco) =>
          estabelecimentoDoBanco.name === dadosDosEstabelecimentos.Ponto.trim(),
      )
    ) {
      await prisma.estabelecimento.create({
        data: {
          name: dadosDosEstabelecimentos.Ponto.trim(),
          site,
          companies: {
            connect: {
              id: 1,
            },
          },
          empresa: {
            connect: {
              name: company,
            },
          },
        },
      });
    }

    const estabelecimentoExist = await estabelecimentoService.encontrarPorNome(
      dadosDosEstabelecimentos.Ponto.trim(),
    );

    if (!estabelecimentoExist) {
      results.push({
        success: false,
        message: `Estabelecimento ${dadosDosEstabelecimentos.Ponto} não encontrado`,
      });
      continue;
    }

    const { success, message } = await registerReportDataJogoDoBicho(
      estabelecimentoExist.id as number,
      weekReference,
      site,
      dadosDosEstabelecimentos.Vendas,
      dadosDosEstabelecimentos["Pgto."],
      dadosDosEstabelecimentos.Líquido,
      importacaoId,
      estabelecimentoExist.matrizId as number,
    );

    results.push({ success, message });
  }

  if (results.some((result) => !result.success)) {
    return { success: false, message: "Algo deu errado ao importar os dados" };
  }

  return { success: true, message: "Importado com sucesso" };
};
