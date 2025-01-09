import xlsx from "xlsx";
import { TFormattedReportBingo } from "@/app/api/v1/types";
import { xlsxReader } from "@/app/api/controller";
import { formatNumber } from "../../formatNumber";
type TDataReportBingo = {
  Sala: string;
  Localidade: string;
  Ponto: string;
  Seção: string;
  Rota: string;
  Venda: string;
  Prêmio: string;
  Comissão: string;
  Líquido: string;
  "Qtd. Cartela": string;
};
type DataItem = {
  Localidade: string;
  Seção: string;
  Rota: string;
  Estabelecimento: string;
  Quantidade: number;
  Vendas: number;
  Prêmio: number;
  Comissão: number;
  Líquido: number;
};
export const formatterReportBingo = (
  worksheet: xlsx.WorkSheet,
): TFormattedReportBingo[] => {
  const header = [
    "Sala",
    "Localidade",
    "Ponto",
    "Seção",
    "Rota",
    "Venda",
    "Prêmio",
    "Comissão",
    "Líquido",
    "Qtd. Cartela",
  ];
  const json = xlsxReader.toJson<TDataReportBingo>(worksheet, { header });

  const dadosOrganizados = json.map((item) => {
    return {
      Localidade: item.Localidade.trim() + " Bingo",
      Seção: item.Seção.trim() + " Bingo",
      Rota: item.Rota.trim() + " Bingo",
      Estabelecimento: item.Ponto.trim(),
      Quantidade: formatNumber(item["Qtd. Cartela"]),
      Vendas: Number((formatNumber(item.Venda) * 100).toFixed(0)),
      Prêmio: Number((formatNumber(item["Prêmio"]) * 100).toFixed(0)),
      Comissão: Number((formatNumber(item["Comissão"]) * 100).toFixed(0)),
      Líquido: Number((formatNumber(item["Líquido"]) * 100).toFixed(0)),
    };
  });
  const isValidItem = (item: DataItem): boolean => {
    return (
      item.Localidade !== undefined &&
      item["Seção"] !== undefined &&
      item.Rota !== undefined &&
      item.Estabelecimento !== undefined &&
      item.Quantidade !== undefined &&
      !isNaN(item.Vendas) &&
      !isNaN(item["Prêmio"]) &&
      !isNaN(item["Comissão"]) &&
      !isNaN(item["Líquido"])
    );
  };
  const dadosFiltrados = dadosOrganizados.filter(isValidItem);
  dadosFiltrados.pop();
  if (dadosFiltrados.length === 0 || !dadosFiltrados) {
    return [];
  }
  return dadosFiltrados;
};
