import { TReportFratec } from "@/app/api/v1/types";

export const changeKeysObjectFratec = (obj: unknown[]): TReportFratec[] => {
  const headerReport = [
    "Localidade",
    "Código Ponto",
    "Nome",
    "Vendas",
    "Comissão",
    "Prêmios Pagos",
    "Líquido",
  ];
  return obj.map((item: any) => {
    let objeto = {} as {
      [key: string]: string | number;
    };
    Object.keys(item).forEach((key, index) => {
      objeto[headerReport[index]] = item[key];
    });
    return objeto as TReportFratec;
  });
};
