import { TReportFratec } from "@/app/api/v1/types";

export const getDataJustOfLocalityCorrect = (
  estabelecimentos: TReportFratec[],
) => {
  return estabelecimentos.filter((estabelecimento) => {
    const LOCALIDADE = ["0B - (2300) PlaySportsSPORTLUCK"];
    return LOCALIDADE.includes(estabelecimento.Localidade);
  });
};
