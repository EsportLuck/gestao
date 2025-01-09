import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";

export const getLinesThatStartWithSixNumbers = (
  reportLines: TOlitecCaratecPlanetaCell[],
) => {
  const regexToValidateThatLineStartsWithSixNumbers = /\d{6}/;
  const estabelecimentos = reportLines.filter((item) =>
    item.Ponto.toString().match(regexToValidateThatLineStartsWithSixNumbers),
  );

  return estabelecimentos;
};
