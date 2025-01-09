import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";

export const fixUnnecessarySpaces = (
  estabelecimentos: TOlitecCaratecPlanetaCell[],
) => {
  return estabelecimentos.map((item) => {
    item.Ponto = item.Ponto.toString()
      .replace(/\s+-\s/g, " - ")
      .trim();
    return item;
  });
};
