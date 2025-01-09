import { TReportFratec } from "@/app/api/v1/types";

export const filterEstablishmentsWithoutSales = (
  estabelecimentos: TReportFratec[],
) => {
  return estabelecimentos.filter((item) => {
    if (item.Vendas === 0 && item.Líquido === 0) return false;
    else return true;
  });
};
