import { WorkSheet } from "xlsx";
import { getLinesThatStartWithSixNumbers } from "./utils/getLinesThatStartWithSixNumbers";
import { filterEstablishmentsWithoutSales } from "./utils/filterEstablishmentsWithoutSales";
import { changeKeysObjectJogoDoBicho } from "./utils/changeKeysObjectJogoDoBicho";
import { fixUnnecessarySpaces } from "./utils/fixUnnecessarySpaces";
import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";

export const formatterReportOlitecCaratecPlaneta = (worksheet: WorkSheet) => {
  const json = xlsxReader.toJson(worksheet);
  const reportWithKeys = changeKeysObjectJogoDoBicho(json);
  const estabelecimentos = getLinesThatStartWithSixNumbers(reportWithKeys);
  const estabelecimentosWithSales =
    filterEstablishmentsWithoutSales(estabelecimentos);

  const estabelecimentosFormatados = fixUnnecessarySpaces(
    estabelecimentosWithSales as TOlitecCaratecPlanetaCell[],
  );

  return estabelecimentosFormatados;
};
