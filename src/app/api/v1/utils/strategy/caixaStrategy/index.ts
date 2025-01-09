import { CaixaController } from "@/app/api/controller";
import { seNaoExistiValorRetornarZero } from "@/utils";
import { obterDiaAnterior } from "@/app/api/v1/utils/obterDiaAnterior";
import { atualizarCaixaMatriz } from "./atualizarCaixaMatriz";
import { prisma } from "@/services/prisma";

type TCaixaStrategy = {
  establishmentId: number | null;
  matrizId: number | null;
  value_search: "value_bicho" | "value_futebol" | "value_loteria";
  liquido: number;
  site: string;
  weekReference: Date;
  idImportacao: number;
  tipo_caixa: "bicho" | "futebol" | "loteria";
};

interface ICaixaStrategy {
  (props: TCaixaStrategy): Promise<void>;
}

export const caixaStrategy: ICaixaStrategy = async ({
  establishmentId,
  matrizId,
  value_search,
  liquido,
  site,
  weekReference,
  idImportacao,
  tipo_caixa,
}) => {
  if (!establishmentId || !value_search || !liquido || !site)
    throw new Error(
      `Some data is missing in caixaStrategy establichment ${establishmentId} matriz ${matrizId} value_search ${value_search} liquido ${liquido} site ${site} weekReference ${weekReference} idImportacao ${idImportacao} tipo_caixa ${tipo_caixa}`,
    );
  try {
    const { startOfDay: gte } = obterDiaAnterior(weekReference.toString());
    const caixaController = new CaixaController();

    const [caixaAtual, caixaAnterior, caixaMatriz, caixaMatrizAnterior] =
      await Promise.all([
        caixaController.encontrarCaixaEmPeridoDeTempo(
          establishmentId,
          new Date(weekReference),
          new Date(weekReference),
        ),
        caixaController.encontrarCaixaEmPeridoDeTempo(
          establishmentId,
          gte,
          gte,
        ),
        caixaController.encontrarCaixaDaMatriz({
          id: matrizId,
          gte: new Date(weekReference),
          lte: new Date(weekReference),
          value_search,
        }),
        caixaController.encontrarCaixaDaMatriz({
          id: matrizId,
          gte,
          lte: new Date(weekReference),
          value_search,
        }),
      ]);

    const atualizou = await atualizarCaixaMatriz(
      matrizId,
      new Date(weekReference),
      new Date(weekReference),
      value_search,
      liquido,
    );
    if (!atualizou && matrizId)
      await caixaController.criarCaixa({
        establishmentId: matrizId,
        value_search,
        liquido: liquido * 100,
        site,
        referenceDate: new Date(weekReference),
        tipo_caixa,
        idImportacao,
        total:
          liquido * 100 +
          seNaoExistiValorRetornarZero(caixaMatrizAnterior?.total),
      });

    const caixaExiste = caixaAtual.length !== 0;
    if (caixaExiste) {
      const valueCaixaSeExistir = seNaoExistiValorRetornarZero(
        caixaAtual[0][value_search],
      );
      const totalGeral =
        Number((liquido * 100).toFixed(0)) + caixaAtual[0].total;
      const totalDoDia = caixaAtual[0][value_search]
        ? Number((liquido * 100).toFixed(0)) + valueCaixaSeExistir
        : Number((liquido * 100).toFixed(0));

      await caixaController.atualizarCaixa(
        caixaAtual[0]?.id,
        totalGeral,
        value_search,
        totalDoDia,
      );
    } else {
      const valueCaixaSeExistir = seNaoExistiValorRetornarZero(
        caixaAnterior[0]?.total,
      );
      const total = Number((liquido * 100).toFixed(0)) + valueCaixaSeExistir;

      await caixaController.criarCaixa({
        total,
        referenceDate: new Date(weekReference),
        site,
        value_search,
        establishmentId,
        tipo_caixa,
        idImportacao,
        liquido: Number((liquido * 100).toFixed(0)),
      });
    }
  } catch (error) {
    console.error("create caixaStrategy", error);
  }
};
