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
  if (!validarValores(reportFormatted)) return [];
  return reportFormatted;
};

const validarValores = (report: TReportAtena[]) => {
  return report.every((item) => {
    if (
      typeof item.Localidade === "string" &&
      typeof item.Seção === "string" &&
      typeof item.Estabelecimento === "string" &&
      typeof item.Quantidade === "number" &&
      typeof item.Vendas === "number" &&
      typeof item.Comissão === "number" &&
      typeof item["Prêmios/Saques"] === "number" &&
      typeof item.Líquido === "number"
    )
      return true;
    else return false;
  });
};
