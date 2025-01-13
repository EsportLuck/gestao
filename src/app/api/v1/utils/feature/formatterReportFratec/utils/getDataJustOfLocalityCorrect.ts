import { TReportFratec } from "@/app/api/v1/types";
import { TFileEstrutura } from "..";

export const getDataJustOfLocalityCorrect = (
  estabelecimentos: TFileEstrutura[],
) => {
  return estabelecimentos.filter((estabelecimento) => {
    const LOCALIDADE = ["0B - (2300) PlaySportsSPORTLUCK"];
    return LOCALIDADE.includes(estabelecimento.Localidade);
  });
};
