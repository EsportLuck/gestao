import { WorkSheet } from "xlsx";
import { getLinesThatStartWithSixNumbers } from "./utils/getLinesThatStartWithSixNumbers";
import { filterEstablishmentsWithoutSales } from "./utils/filterEstablishmentsWithoutSales";
import { changeKeysObjectJogoDoBicho } from "./utils/changeKeysObjectJogoDoBicho";
import { fixUnnecessarySpaces } from "./utils/fixUnnecessarySpaces";
import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";

export type TReportJogoDoBicho = {
  Estabelecimento: string;
  Quantidade: number;
  Vendas: number;
  Comissão: number;
  Prêmios: number;
  Líquido: number;
};

export const formatterReportOlitecCaratecPlaneta = (
  worksheet: WorkSheet,
): TReportJogoDoBicho[] => {
  const json = xlsxReader.toJson(worksheet);

  const reportWithKeys = changeKeysObjectJogoDoBicho(json);
  const estabelecimentos = getLinesThatStartWithSixNumbers(reportWithKeys);
  const estabelecimentosWithSales =
    filterEstablishmentsWithoutSales(estabelecimentos);

  const estabelecimentosFormatados = fixUnnecessarySpaces(
    estabelecimentosWithSales as TOlitecCaratecPlanetaCell[],
  );

  const obterValoresEmFormatoParaSalvarNoBanco = estabelecimentosFormatados.map(
    (item) => {
      const Comissão = Number((item.Vendas * 0.2 * 100).toFixed(0));
      const PrêmiosPagos = Number(
        ((item["Pgto."] - item.Vendas * 0.2) * 100).toFixed(0),
      );
      return {
        Estabelecimento: item.Ponto,
        Quantidade: 0,
        Vendas: Number((item.Vendas * 100).toFixed(0)),
        Comissão,
        Prêmios: Math.abs(PrêmiosPagos),
        Líquido: Number((item.Líquido * 100).toFixed(0)),
      };
    },
  );
  const validarValores = obterValoresEmFormatoParaSalvarNoBanco.every(
    (item) => {
      if (
        typeof item.Estabelecimento === "string" &&
        item.Quantidade === 0 &&
        !isNaN(item.Vendas) &&
        !isNaN(item.Comissão) &&
        !isNaN(item.Prêmios) &&
        !isNaN(item.Líquido)
      ) {
        return true;
      } else return false;
    },
  );
  if (!validarValores) {
    return [];
  }

  return obterValoresEmFormatoParaSalvarNoBanco;
};
