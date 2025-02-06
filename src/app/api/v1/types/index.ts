import { WorkSheet } from "xlsx";

export type TOlitecCaratecPlanetaCell = {
  Ponto: string;
  "V. Bruta": number;
  Vendas: number;
  "Pgto.": number;
  Líquido: number;
  Recarga: number;
  Braga: number;
  Bolão: number;
  "Vale Mot": number;
  "Vale Camb": number;
  "Vale Cel": number;
  Acertos: number;
  Lucro: number;
  Prejuízo: number;
};

export type TReportFratec = {
  Localidade: string;
  Nome: string;
  Vendas: number;
  Comissão: number;
  "Prêmios Pagos": number;
  Líquido: number;
};

export type TAtena = {
  Localidade: string;
  "Centro de Custo": string;
  Seção: string;
  Estabelecimento: string;
  Quantidade: number;
  Vendas: number;
  Comissão: number;
  "Comis. Retida": number;
  "Qtd Prêmios/Saques": number;
  "Prêmios/Saques": number;
  Líquido: number;
  "% Liquida": number;
};
export type TReportAtena = {
  Localidade: string;
  Seção: string;
  Estabelecimento: string;
  Vendas: number;
  Quantidade: number;
  Comissão: number;
  "Prêmios/Saques": number;
  Líquido: number;
};

export type TReportBet = {
  Colaborador: string;
  Quantidade: string;
  Entradas: string;
  "Entradas em Aberto": string;
  Saídas: string;
  Comissões: string;
  Total: string;
};

export type IReportVip = {
  "Cód.": string;
  Cambista: string;
  "Qtd. bilhetes": string;
  "Qtd. jogos": string;
  "Valor apostado": string;
  "Valor Pago": string;
  "Comissão cambista": string;
  "Líq. Camb": string;
  "Comissão Supervisor": string;
  "Valor Líq.": string;
};

export interface IFormattedReportSportNet {
  Estabelecimento: string;
  Vendas: number;
  Quantidade: number;
  Comissão: number;
  "Prêmios/Saques": number;
  Líquido: number;
}

export type TFormattedReportArenaSite = {
  estabelecimento: string;
  quantidade: number;
  vendas: number;
  comissao: number;
  premios: number;
  liquido: number;
};

export type TFormattedReportBingo = {
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

export interface IFormatterType {
  "4712 - arena sportluck": TFormattedReportBingo[];
  "4713 - estancia": TFormattedReportBingo[];
  "7501 - rota sportluck andre": TFormattedReportBingo[];
  "7503 - rota luck": TFormattedReportBingo[];
  olitec: (worksheet: WorkSheet) => TOlitecCaratecPlanetaCell[];
  "planeta-cell": (worksheet: WorkSheet) => TOlitecCaratecPlanetaCell[];
  caratec: (worksheet: WorkSheet) => TOlitecCaratecPlanetaCell[];
  fratec: (worksheet: WorkSheet) => TReportFratec[];
  "arena.site": (worksheet: WorkSheet) => TFormattedReportArenaSite[];
  "1738 - banca luck": (worksheet: WorkSheet) => TReportAtena[];
  "2300 - playsports sport luck": (worksheet: WorkSheet) => TReportAtena[];
  "4700 - rv luck": (worksheet: WorkSheet) => TReportAtena[];
  "5635 - sport luck": (worksheet: WorkSheet) => TReportAtena[];
  "6147 - neri pernambuco": (worksheet: WorkSheet) => TReportAtena[];
  "6347 - unialagoas": (worksheet: WorkSheet) => TReportAtena[];
  "6648 - andre carioca": (worksheet: WorkSheet) => TReportAtena[];
  "6649 - roge saco": (worksheet: WorkSheet) => TReportAtena[];
  "6803 - bruno sport luck": (worksheet: WorkSheet) => TReportAtena[];
  "6651 - wagner prata": (worksheet: WorkSheet) => TReportAtena[];
  "sportvip - wendel ita": (worksheet: WorkSheet) => IFormattedReportSportNet[];
  "sportvip - wendel/londrina": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportvip - junior magalhaes": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportvip - wendel esportenet jb": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportvip - luciano baiano/wendel pe": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportvip - wendel/minas": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportvip - renan coutinho": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - luciano baiano/wendel pe": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendel ita": (worksheet: WorkSheet) => IFormattedReportSportNet[];
  "sportbet - wendel/londrina": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendel/minas": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendel esportenet jb": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendelpernambuco": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendel rn": (worksheet: WorkSheet) => IFormattedReportSportNet[];
  "sportbet - maceiowendel": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendelcoruripe": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendelpilar": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendelriolargo": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendelsaomiguel": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - wendeluniao": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportbet - junior magalhaes": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportshow - wendel rn": (worksheet: WorkSheet) => IFormattedReportSportNet[];
  "sportshow - wendelpernambuco": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportshow - wendel alagoas sup": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
  "sportshow - tiago canide": (
    worksheet: WorkSheet,
  ) => IFormattedReportSportNet[];
}

export type TReportOptions = "olitec" | "caratec" | "planeta-cell" | "atena";

export type TReportEsportNet =
  | "sportvip - wendel ita"
  | "sportvip - wendel/londrina"
  | "sportvip - junior magalhaes"
  | "sportvip - wendel esportenet jb"
  | "sportvip - luciano baiano/wendel pe"
  | "sportvip - wendel/minas"
  | "sportvip - renan coutinho"
  | "sportbet - luciano baiano/wendel pe"
  | "sportbet - wendel ita"
  | "sportbet - wendel/londrina"
  | "sportbet - wendel/minas"
  | "sportbet - wendel esportenet jb"
  | "sportbet - wendelpernambuco"
  | "sportbet - wendel rn"
  | "sportbet - maceiowendel"
  | "sportbet - wendelcoruripe"
  | "sportbet - wendelpilar"
  | "sportbet - wendelriolargo"
  | "sportbet - wendelsaomiguel"
  | "sportbet - wendeluniao"
  | "sportbet - junior magalhaes"
  | "sportshow - wendel rn"
  | "sportshow - wendelpernambuco"
  | "sportshow - wendel alagoas sup"
  | "sportshow - tiago canide";
