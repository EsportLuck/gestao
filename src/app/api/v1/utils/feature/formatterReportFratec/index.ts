import { changeKeysObjectFratec } from "./utils/changeKeysObjectFratec";
import { getDataJustOfLocalityCorrect } from "./utils/getDataJustOfLocalityCorrect";
import { formatterValuesInKeysOfReport } from "./utils/formatterValuesInKeysOfReport";
import { filterEstablishmentsWithoutSales } from "./utils/filterEstablishmentsWithoutSales";
import { TReportFratec } from "@/app/api/v1/types";
import { WorkSheet } from "xlsx";
import { xlsxReader } from "@/app/api/controller";

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
  return formattedReport;
};
