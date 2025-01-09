import xlsx from "xlsx";
import { formatterData } from "./utils/formatterData";
import { TAtena, TReportAtena } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";

export const formatterReportAtena = (worksheet: xlsx.WorkSheet) => {
  const json = xlsxReader.toJson<TAtena>(worksheet);
  const filterVendasAndLiquidoZero = json.filter((item) => {
    if (item.Vendas === 0 && item.Líquido === 0) return false;
    else return true;
  });
  const filterValuesUndefined = filterVendasAndLiquidoZero.filter(
    (item) => item["Centro de Custo"] !== "Total",
  );
  const reportFormatted: TReportAtena[] = formatterData(filterValuesUndefined);
  return reportFormatted;
};
