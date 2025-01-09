import { CaixaRepository, ImportarRepository } from "@/app/api/repositories";
import { CaixaService, ImportacaoService } from "@/app/api/services";
import { Caixa } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import {
  getImportacaoData,
  findLiquidoBelongingToCaixa,
  stratigyCash,
  choiceCash,
  deleteImportacao,
  getId,
  findEstalecimentosThatContentFilial,
} from "@/app/api/use-cases/utils";

export const deleteImportacaoUseCase = async (
  weekReference: string,
  site: string,
  idImportacao: number,
  token: JWT | null,
) => {
  try {
    const importacaoService = new ImportacaoService(new ImportarRepository());
    const dataImportacao = await getImportacaoData(
      idImportacao,
      new Date(weekReference),
    );

    if (
      !dataImportacao?.AllCaixa.caixa ||
      !dataImportacao?.AllLiquidos.liquido ||
      !dataImportacao?.AllVendas.vendas ||
      !dataImportacao?.AllComissao.comissao ||
      !dataImportacao?.AllPremios.premios
    ) {
      throw new Error("Erro ao obter dados de importacao ");
    }
    const liquido = dataImportacao.AllLiquidos.liquido;
    const caixa = dataImportacao.AllCaixa.caixa;
    const vendas = dataImportacao.AllVendas.vendas;
    const comissao = dataImportacao.AllComissao.comissao;
    const premios = dataImportacao.AllPremios.premios;
    const estabelecimentosThatContentFilial =
      await findEstalecimentosThatContentFilial(caixa as Caixa[]);
    const liquidoComSeuRespectivoCaixa = findLiquidoBelongingToCaixa(
      caixa as Caixa[],
      liquido,
    );

    for await (const caixaComSeuRespectivoLiquido of liquidoComSeuRespectivoCaixa) {
      const caixaService = new CaixaService(new CaixaRepository());
      const matriz = estabelecimentosThatContentFilial.find(
        (estabelecimentoThatContentFilial) =>
          estabelecimentoThatContentFilial?.id ===
          caixaComSeuRespectivoLiquido.caixa.establishmentId,
      );
      if (matriz) {
        const data = stratigyCash(
          site,
          caixaComSeuRespectivoLiquido.caixa.total,
          caixaComSeuRespectivoLiquido.liquidoCorrespondenteAoCaixa,
          choiceCash(caixaComSeuRespectivoLiquido.caixa, site),
        );
        await caixaService.update(caixaComSeuRespectivoLiquido.caixa.id, data);
      } else {
        const data = stratigyCash(
          site,
          caixaComSeuRespectivoLiquido.caixa.total,
          caixaComSeuRespectivoLiquido.liquidoCorrespondenteAoCaixa,
          choiceCash(caixaComSeuRespectivoLiquido.caixa, site),
        );
        await caixaService.update(caixaComSeuRespectivoLiquido.caixa.id, data);
      }
    }

    await deleteImportacao(
      getId(liquido),
      getId(vendas),
      getId(comissao),
      getId(premios),
    );

    await importacaoService.atualizarImportacao(Number(idImportacao), {
      state: "Apagado",
      modifiedBy: token?.username as string,
    });
    return;
  } catch (error) {
    console.error("import delete", error);
  }
};
