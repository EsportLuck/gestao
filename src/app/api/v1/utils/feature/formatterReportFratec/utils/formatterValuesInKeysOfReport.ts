import { TReportFratec } from "@/app/api/v1/types";
import { formatNumber } from "../../../formatNumber";
import { TFileEstrutura } from "..";

export const formatterValuesInKeysOfReport = (
  estabelecimentos: TFileEstrutura[],
): TReportFratec[] => {
  return estabelecimentos.map((estabelecimento) => {
    const Localidade = "2300 - PlaySports Sport Luck";
    const Nome = estabelecimento.Nome.trim();
    const Vendas = Number(
      (formatNumber(estabelecimento.Vendas) * 100).toFixed(0),
    );
    const Comissão = Number(
      (formatNumber(estabelecimento.Comissão) * 100).toFixed(0),
    );
    const PrêmiosPagos = Number(
      (formatNumber(estabelecimento["Prêmios Pagos"]) * 100).toFixed(0),
    );
    const Líquido = Number(
      (formatNumber(estabelecimento.Líquido) * 100).toFixed(0),
    );
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
