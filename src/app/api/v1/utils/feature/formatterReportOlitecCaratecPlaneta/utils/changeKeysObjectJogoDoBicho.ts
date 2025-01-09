import { TOlitecCaratecPlanetaCell } from "@/app/api/v1/types";

export const changeKeysObjectJogoDoBicho = (
  obj: unknown[],
): TOlitecCaratecPlanetaCell[] => {
  const headerReport = [
    "Ponto",
    "V. Bruta",
    "Vendas",
    "Pgto.",
    "Líquido",
    "Recarga",
    "Braga",
    "Bolão",
    "Vale Mot",
    "Vale Camb",
    "Vale Cel",
    "Acertos",
    "Lucro",
    "Prejuízo",
  ];
  return obj.map((item: any) => {
    let objeto = {} as {
      [key: string]: string | number;
    };
    Object.keys(item).forEach((key, index) => {
      objeto[headerReport[index]] = item[key];
    });
    return objeto as TOlitecCaratecPlanetaCell;
  });
};
