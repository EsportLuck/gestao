import xlsx from "xlsx";
import { xlsxReader } from "@/app/api/controller";
import { formatNumber } from "@/app/api/v1/utils/formatNumber";
import { TFormattedReportArenaSite } from "@/app/api/v1/types";

type TArenaSite = {
  "#": string;
  Cambista: string;
  Qtd: string;
  "N.Aberto": string;
  Bruto: string;
  "Vl.Aberto": string;
  Comissões: string;
  Prêmios: string;
  Despesas: string;
  Liquido: string;
  Adiantamentos: string;
  Pagamentos: string;
  "A receber": string;
  __EMPTY: string;
};

export const formatterReportArenaSite = (
  worksheet: xlsx.WorkSheet,
): TFormattedReportArenaSite[] => {
  const json = xlsxReader.toJson<TArenaSite>(worksheet);
  const data: TFormattedReportArenaSite[] = json.map((item) => {
    return {
      estabelecimento: item.Cambista.trim(),
      quantidade: Number(item.Qtd),
      vendas: Number((formatNumber(item.Bruto) * 100).toFixed(0)),
      comissao: Number((formatNumber(item.Comissões) * 100).toFixed(0)),
      premios: Number((formatNumber(item.Prêmios) * 100).toFixed(0)),
      liquido: Number((formatNumber(item.Liquido) * 100).toFixed(0)),
    };
  });
  if (!validarDados(data)) {
    return [];
  }
  return data;
};

const validarDados = (data: TFormattedReportArenaSite[]) => {
  return data.every((item) => {
    return (
      item.estabelecimento !== undefined &&
      item.quantidade !== undefined &&
      !isNaN(item.vendas) &&
      !isNaN(item.comissao) &&
      !isNaN(item.premios) &&
      !isNaN(item.liquido)
    );
  });
};
