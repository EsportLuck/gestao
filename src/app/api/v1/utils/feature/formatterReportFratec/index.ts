import { changeKeysObjectFratec } from "./utils/changeKeysObjectFratec";
import { getDataJustOfLocalityCorrect } from "./utils/getDataJustOfLocalityCorrect";
import { formatterValuesInKeysOfReport } from "./utils/formatterValuesInKeysOfReport";
import { filterEstablishmentsWithoutSales } from "./utils/filterEstablishmentsWithoutSales";
import { TReportFratec } from "@/app/api/v1/types";
import { WorkSheet } from "xlsx";
import { xlsxReader } from "@/app/api/controller";
export type TFileEstrutura = {
  Localidade: string;
  "Código Ponto": string;
  Nome: string;
  Vendas: string;
  Comissão: string;
  "Prêmios Pagos": string;
  Líquido: string;
};
export const formatterReportFratec = (worksheet: WorkSheet) => {
  const json = xlsxReader.toJson(worksheet);
  const reportWithKeys = changeKeysObjectFratec(json);
  const findEstabelecimentoWithSales =
    filterEstablishmentsWithoutSales(reportWithKeys);
  const findEstabelecimentosOfLocalityCorrect = getDataJustOfLocalityCorrect(
    findEstabelecimentoWithSales,
  );

  const formattedReport: TReportFratec[] = formatterValuesInKeysOfReport(
    findEstabelecimentosOfLocalityCorrect,
  );
  if (!isValid(formattedReport)) return [];

  return formattedReport;
};

function isValid(formattedReport: TReportFratec[]) {
  return formattedReport.every((item) => {
    if (
      typeof item.Nome === "string" &&
      isNaN(item.Vendas) &&
      isNaN(item.Comissão) &&
      isNaN(item["Prêmios Pagos"]) &&
      isNaN(item.Líquido)
    )
      return true;
    else return false;
  });
}
