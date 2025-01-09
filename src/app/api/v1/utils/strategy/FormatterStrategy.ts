import { WorkSheet } from "xlsx";

import {
  formatterReportAtena,
  formatterReportFratec,
  formatterReportOlitecCaratecPlaneta,
  formatterReportVip,
  formatterReportBet,
  formatterReportArenaSite,
  formatterReportBingo,
} from "@/app/api/v1/utils/feature";
import { TFile } from "@/app/api/services";

export enum ReportCategory {
  VIP = "VIP",
  BET = "BET",
  ARENA = "ARENA",
  JOGO_DO_BICHO = "JOGO_DO_BICHO",
  LOTERIA = "LOTERIA",
  ARENA_SITE = "ARENA_SITE",
  BINGO = "BINGO",
}
export interface FormatterFunctions {
  "4712 - arena sportluck": typeof formatterReportBingo;
  "4713 - estancia": typeof formatterReportBingo;
  "7501 - rota sportluck andre": typeof formatterReportBingo;
  "7503 - rota luck": typeof formatterReportBingo;
  olitec: typeof formatterReportOlitecCaratecPlaneta;
  caratec: typeof formatterReportOlitecCaratecPlaneta;
  "planeta-cell": typeof formatterReportOlitecCaratecPlaneta;
  fratec: typeof formatterReportFratec;
  "arena.site": typeof formatterReportArenaSite;
  "1738 - banca luck": typeof formatterReportAtena;
  "2300 - arena sport luck": typeof formatterReportAtena;
  "4700 - rv luck": typeof formatterReportAtena;
  "5635 - sport luck": typeof formatterReportAtena;
  "6147 - neri pernambuco": typeof formatterReportAtena;
  "6347 - unialagoas": typeof formatterReportAtena;
  "6648 - andre carioca": typeof formatterReportAtena;
  "6649 - roge saco": typeof formatterReportAtena;
  "6803 - bruno sport luck": typeof formatterReportAtena;
  "6651 - wagner prata": typeof formatterReportAtena;
  "sportvip - wendel ita": typeof formatterReportVip;
  "sportvip - wendel/londrina": typeof formatterReportVip;
  "sportvip - junior magalhaes": typeof formatterReportVip;
  "sportvip - luciano baiano/wendel pe": typeof formatterReportVip;
  "sportvip - wendel/minas": typeof formatterReportVip;
  "sportvip - renan coutinho": typeof formatterReportVip;
  "sportshow - wendel rn": typeof formatterReportVip;
  "sportshow - wendelpernambuco": typeof formatterReportVip;
  "sportshow - wendel alagoas sup": typeof formatterReportVip;
  "sportshow - tiago canide": typeof formatterReportVip;
  "sportbet - luciano baiano/wendel pe": typeof formatterReportBet;
  "sportbet - wendel ita": typeof formatterReportBet;
  "sportbet - wendel/londrina": typeof formatterReportBet;
  "sportbet - wendel/minas": typeof formatterReportBet;
  "sportbet - wendel esportenet jb": typeof formatterReportBet;
  "sportbet - wendelpernambuco": typeof formatterReportBet;
  "sportbet - wendel rn": typeof formatterReportBet;
  "sportbet - maceiowendel": typeof formatterReportBet;
  "sportbet - wendelcoruripe": typeof formatterReportBet;
  "sportbet - wendelpilar": typeof formatterReportBet;
  "sportbet - wendelriolargo": typeof formatterReportBet;
  "sportbet - wendelsaomiguel": typeof formatterReportBet;
  "sportbet - wendeluniao": typeof formatterReportBet;
  "sportbet - junior magalhaes": typeof formatterReportBet;
}

export const formatterMap: FormatterFunctions = {
  "4712 - arena sportluck": formatterReportBingo,
  "4713 - estancia": formatterReportBingo,
  "7501 - rota sportluck andre": formatterReportBingo,
  "7503 - rota luck": formatterReportBingo,
  olitec: formatterReportOlitecCaratecPlaneta,
  caratec: formatterReportOlitecCaratecPlaneta,
  "planeta-cell": formatterReportOlitecCaratecPlaneta,
  fratec: formatterReportFratec,
  "arena.site": formatterReportArenaSite,
  "1738 - banca luck": formatterReportAtena,
  "2300 - arena sport luck": formatterReportAtena,
  "4700 - rv luck": formatterReportAtena,
  "5635 - sport luck": formatterReportAtena,
  "6147 - neri pernambuco": formatterReportAtena,
  "6347 - unialagoas": formatterReportAtena,
  "6648 - andre carioca": formatterReportAtena,
  "6649 - roge saco": formatterReportAtena,
  "6803 - bruno sport luck": formatterReportAtena,
  "6651 - wagner prata": formatterReportAtena,
  "sportvip - wendel ita": formatterReportVip,
  "sportvip - wendel/londrina": formatterReportVip,
  "sportvip - junior magalhaes": formatterReportVip,
  "sportvip - luciano baiano/wendel pe": formatterReportVip,
  "sportvip - wendel/minas": formatterReportVip,
  "sportvip - renan coutinho": formatterReportVip,
  "sportshow - wendel rn": formatterReportVip,
  "sportshow - wendelpernambuco": formatterReportVip,
  "sportshow - wendel alagoas sup": formatterReportVip,
  "sportshow - tiago canide": formatterReportVip,
  "sportbet - luciano baiano/wendel pe": formatterReportBet,
  "sportbet - wendel ita": formatterReportBet,
  "sportbet - wendel/londrina": formatterReportBet,
  "sportbet - wendel/minas": formatterReportBet,
  "sportbet - wendel esportenet jb": formatterReportBet,
  "sportbet - wendelpernambuco": formatterReportBet,
  "sportbet - wendel rn": formatterReportBet,
  "sportbet - maceiowendel": formatterReportBet,
  "sportbet - wendelcoruripe": formatterReportBet,
  "sportbet - wendelpilar": formatterReportBet,
  "sportbet - wendelriolargo": formatterReportBet,
  "sportbet - wendelsaomiguel": formatterReportBet,
  "sportbet - wendeluniao": formatterReportBet,
  "sportbet - junior magalhaes": formatterReportBet,
};

export const reportSites = {
  [ReportCategory.VIP]: [
    "sportvip - wendel ita",
    "sportvip - wendel/londrina",
    "sportvip - junior magalhaes",
    "sportvip - luciano baiano/wendel pe",
    "sportvip - wendel/minas",
    "sportvip - renan coutinho",
    "sportshow - wendel rn",
    "sportshow - wendelpernambuco",
    "sportshow - wendel alagoas sup",
    "sportshow - tiago canide",
  ],
  [ReportCategory.BET]: [
    "sportbet - luciano baiano/wendel pe",
    "sportbet - wendel ita",
    "sportbet - wendel/londrina",
    "sportbet - wendel/minas",
    "sportbet - wendel esportenet jb",
    "sportbet - wendelpernambuco",
    "sportbet - wendel rn",
    "sportbet - maceiowendel",
    "sportbet - wendelcoruripe",
    "sportbet - wendelpilar",
    "sportbet - wendelriolargo",
    "sportbet - wendelsaomiguel",
    "sportbet - wendeluniao",
    "sportbet - junior magalhaes",
  ],
  [ReportCategory.ARENA]: [
    "1738 - banca luck",
    "2300 - arena sport luck",
    "4700 - rv luck",
    "5635 - sport luck",
    "6147 - neri pernambuco",
    "6347 - unialagoas",
    "6648 - andre carioca",
    "6649 - roge saco",
    "6803 - bruno sport luck",
    "6651 - wagner prata",
  ],
  [ReportCategory.JOGO_DO_BICHO]: ["olitec", "caratec", "planeta-cell"],
  [ReportCategory.LOTERIA]: ["fratec"],
  [ReportCategory.ARENA_SITE]: ["arena.site"],
  [ReportCategory.BINGO]: [
    "4712 - arena sportluck",
    "4712 - arena sportluck",
    "4713 - estancia",
    "7501 - rota sportluck andre",
    "7503 - rota luck",
  ],
};

export class FormatterStrategy {
  public async execute(
    site: keyof FormatterFunctions,
    worksheet: WorkSheet,
  ): Promise<
    | { success: false; message: string; file: undefined }
    | { success: true; message: string; file: TFile }
  > {
    const category = this.getSiteCategory(site);
    if (!category)
      return {
        success: false,
        message:
          "Site não encontrado, verifique se o nome do site está correto",
        file: undefined,
      };
    const formatter = formatterMap[site](worksheet);
    if (formatter.length === 0)
      return {
        success: false,
        message: "Não há dados para formatar",
        file: undefined,
      };

    return {
      success: true,
      message: "Formatado com sucesso",
      file: formatter,
    };
  }
  private getSiteCategory(
    site: Extract<keyof typeof formatterMap, string>,
  ): ReportCategory | null {
    for (const [category, sites] of Object.entries(reportSites)) {
      if (sites.includes(site)) {
        return category as ReportCategory;
      }
    }
    return null;
  }
}
