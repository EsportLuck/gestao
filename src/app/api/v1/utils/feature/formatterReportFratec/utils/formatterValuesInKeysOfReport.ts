import { TReportFratec } from "@/app/api/v1/types";

export const formatterValuesInKeysOfReport = (
  estabelecimentos: TReportFratec[],
) => {
  return estabelecimentos.map((estabelecimento) => {
    const Localidade = "2300 - PlaySports Sport Luck";
    const Nome = estabelecimento.Nome.trim();
    const Vendas = estabelecimento.Vendas / 100;
    const Comissão = estabelecimento.Comissão / 100;
    const PrêmiosPagos = estabelecimento["Prêmios Pagos"] / 100;
    const Líquido = estabelecimento.Líquido / 100;
    return {
      Localidade,
      Nome,
      Vendas,
      Comissão,
      "Prêmios Pagos": PrêmiosPagos,
      Líquido,
    };
  });
};
