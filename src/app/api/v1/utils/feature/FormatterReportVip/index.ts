import { WorkSheet } from "xlsx";
import { formatNumber } from "@/app/api/v1/utils/formatNumber";
import { IFormattedReportSportNet, IReportVip } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";

export const formatterReportVip = (
  data: WorkSheet,
): IFormattedReportSportNet[] => {
  const reportJson = xlsxReader.toJson<IReportVip>(data, {
    rawNumbers: false,
  });
  const establishments = rowsWithEstablishments(reportJson);
  const establishmentsWithSales = establishmentWithSales(establishments);
  return establishmentsWithSales.map((item): IFormattedReportSportNet => {
    return {
      Estabelecimento: item["Cód."] + " - " + item.Cambista.trim(),
      Vendas: Number((formatNumber(item["Valor apostado"]) * 100).toFixed(0)),
      Quantidade: formatNumber(item["Qtd. bilhetes"]),
      Comissão: Number(
        (formatNumber(item["Comissão cambista"]) * 100).toFixed(0),
      ),
      "Prêmios/Saques": Number(
        (formatNumber(item["Valor Pago"]) * 100).toFixed(0),
      ),
      Líquido: Number((formatNumber(item["Líq. Camb"]) * 100).toFixed(0)),
    };
  });
};

function establishmentWithSales(data: IReportVip[]) {
  return data.filter((item) => {
    if (item["Líq. Camb"] == "0,00" && item["Valor apostado"] == "0,00") {
      return false;
    } else {
      return true;
    }
  });
}

function rowsWithEstablishments(data: IReportVip[]) {
  return data.filter((item) => {
    return item.Cambista !== "Total";
  });
}
