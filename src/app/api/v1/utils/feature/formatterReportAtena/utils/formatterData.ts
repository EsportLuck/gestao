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
      Quantidade: Number(
        (stringToNumber(estabelecimento.Quantidade) * 100).toFixed(0),
      ),
      Vendas: Number((stringToNumber(estabelecimento.Vendas) * 100).toFixed(0)),
      Comissão: Number(
        (stringToNumber(estabelecimento.Comissão) * 100).toFixed(0),
      ),
      "Prêmios/Saques": Number(
        (stringToNumber(estabelecimento["Prêmios/Saques"]) * 100).toFixed(0),
      ),
      Líquido: Number(
        (stringToNumber(estabelecimento.Líquido) * 100).toFixed(0),
      ),
    };
  });
};
