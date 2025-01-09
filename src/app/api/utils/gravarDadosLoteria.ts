import { Localidade, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { EstabelecimentoService, LocalidadeService } from "@/app/api/services";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { TReportFratec } from "@/app/api/v1/types";
import {
  EstabelecimentoRepository,
  LocalidadeRepository,
} from "@/app/api/repositories";
import { prisma } from "@/services/prisma";
import { registerReportLoteria } from "../v1/utils/create";

export const gravarDadosLoteria = async (
  file: TReportFratec[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  localidadesNoBanco: Localidade[] | null,
  _secaoNoBanco: Secao[] | null,
  importacaoId: number,
): Promise<
  | { success: true; message: "Importado com sucesso" }
  | { success: false; message: string }
> => {
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );
  const localidadeService = new LocalidadeService(new LocalidadeRepository());
  const localidadeDoArquivo = file.map((dadosDosEstabelecimentos) => {
    return dadosDosEstabelecimentos.Localidade;
  });
  const localidadeSemRepetir = localidadeDoArquivo.filter(
    (localidade, index, self) =>
      index === self.indexOf(localidade) && localidade,
  );
  if (
    !localidadesNoBanco?.find((localidadeNoBanco) =>
      localidadeSemRepetir.find((name) => localidadeNoBanco.name === name),
    )
  ) {
    for (const localidade of localidadeSemRepetir) {
      await localidadeService.criar(localidade, company);
    }
  }

  const results = [];
  for await (const dadosDosEstabelecimentos of file) {
    if (
      !estabelecimentosNoBanco?.find(
        (estabelecimentoDoBanco) =>
          estabelecimentoDoBanco.name === dadosDosEstabelecimentos.Nome.trim(),
      )
    ) {
      await prisma.estabelecimento.create({
        data: {
          name: dadosDosEstabelecimentos.Nome.trim(),
          site,
          empresa: {
            connect: {
              name: company,
            },
          },
          companies: {
            connect: {
              id: 1,
            },
          },
        },
      });
    }
    const estabelecimentoExist = await estabelecimentoService.encontrarPorNome(
      dadosDosEstabelecimentos.Nome.trim(),
    );

    const localidadeExist = await localidadeService.encontrarPorNome(
      dadosDosEstabelecimentos.Localidade,
    );

    if (!estabelecimentoExist || !localidadeExist) {
      results.push({
        success: false,
        message: `Estabelecimento ${dadosDosEstabelecimentos.Nome} não encontrado`,
      });
      continue;
    }

    const { success, message } = await registerReportLoteria(
      estabelecimentoExist.id as number,
      weekReference,
      site,
      dadosDosEstabelecimentos.Vendas,
      dadosDosEstabelecimentos.Comissão,
      dadosDosEstabelecimentos["Prêmios Pagos"],
      dadosDosEstabelecimentos.Líquido,
      importacaoId,
      estabelecimentoExist.matrizId as number,
    );

    results.push({ success, message });
  }

  if (results.some((result) => !result.success)) {
    return {
      success: false,
      message: "Algo deu errado ao importar os dados gravarDadosLoteria",
    };
  }

  return { success: true, message: "Importado com sucesso" };
};
