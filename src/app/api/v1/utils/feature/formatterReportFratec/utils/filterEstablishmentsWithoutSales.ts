import { TReportFratec } from "@/app/api/v1/types";
import { TFileEstrutura } from "..";

export const filterEstablishmentsWithoutSales = (
  estabelecimentos: TFileEstrutura[],
) => {
  return estabelecimentos.filter((item) => {
    if (item.Vendas === "0,00" && item.Líquido === "0,00") return false;
    else return true;
  });
};
