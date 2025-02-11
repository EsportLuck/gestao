import { WorkSheet } from "xlsx";
import { formatNumber } from "@/app/api/v1/utils/formatNumber";
import { IFormattedReportSportNet, TReportBet } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";

export const formatterReportBet = (data: WorkSheet) => {
  const dataFile = xlsxReader.toJson<TReportBet>(data, {
    rawNumbers: false,
  });
  const reportBet = formatStructureAndValues(dataFile);
  const establishmentsWithSales = removeEstablishmentWithOutSales(reportBet);
  const establishments = removeRowsWithOutEstablishments(
    establishmentsWithSales,
  );
  const validData = validarDados(establishments);
  return validData;
};

function formatStructureAndValues(
  data: TReportBet[],
): IFormattedReportSportNet[] {
  return data.map((item) => {
    return {
      Estabelecimento: item.Colaborador.trim(),
      Vendas: Number((formatNumber(item.Entradas) * 100).toFixed(0)),
      Quantidade: formatNumber(item.Quantidade),
      Comissão: Number((formatNumber(item.Comissões) * 100).toFixed(0)),
      "Prêmios/Saques": Number((formatNumber(item.Saídas) * 100).toFixed(0)),
      Líquido: Number((formatNumber(item.Total) * 100).toFixed(0)),
    };
  });
}

function removeEstablishmentWithOutSales(data: IFormattedReportSportNet[]) {
  return data.filter((item) => {
    if (item.Vendas === 0 && item.Líquido === 0) {
      return false;
    } else {
      return true;
    }
  });
}
function removeRowsWithOutEstablishments(data: IFormattedReportSportNet[]) {
  return data.filter((item) => item.Estabelecimento !== "TOTAL");
}

function validarDados(
  dados: IFormattedReportSportNet[],
): IFormattedReportSportNet[] {
  const formatoValido = (
    item: IFormattedReportSportNet,
  ): item is IFormattedReportSportNet => {
    return (
      typeof item.Estabelecimento === "string" &&
      !isNaN(item.Vendas) &&
      !isNaN(item.Quantidade) &&
      !isNaN(item.Comissão) &&
      !isNaN(item["Prêmios/Saques"]) &&
      !isNaN(item.Líquido)
    );
  };

  return dados.every(formatoValido) ? dados : [];
}
