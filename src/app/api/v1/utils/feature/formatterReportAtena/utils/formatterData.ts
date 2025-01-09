import { TAtena } from "@/app/api/v1/types";

export const formatterData = (estabelecimentos: TAtena[]) => {
  function stringToNumber(number: string | number) {
    if (typeof number === "number") return number;
    return Number(number.replace(".", "").replace(",", "."));
  }

  return estabelecimentos.map((estabelecimento) => {
    return {
      Localidade: estabelecimento.Localidade.trim(),
      Seção: estabelecimento.Seção.trim(),
      Estabelecimento: estabelecimento.Estabelecimento.trim(),
      Quantidade: stringToNumber(estabelecimento.Quantidade),
      Vendas: stringToNumber(estabelecimento.Vendas),
      Comissão: stringToNumber(estabelecimento.Comissão),
      "Prêmios/Saques": stringToNumber(estabelecimento["Prêmios/Saques"]),
      Líquido: stringToNumber(estabelecimento.Líquido),
    };
  });
};
