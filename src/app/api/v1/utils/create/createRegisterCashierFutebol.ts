import { prisma } from "@/services/prisma";
import { caixaStrategy } from "@/app/api/v1/utils/strategy";

export const createRegisterCashierFutebol = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  liquido: number,
  idImportacao: number,
  matrizId: number | null,
) => {
  if (
    !estabelecimento ||
    !weekReference ||
    !site ||
    typeof liquido !== "number" ||
    !idImportacao
  )
    throw new Error("Some data is missing in createRegisterCashierFutebol");
  try {
    await caixaStrategy({
      establishmentId: estabelecimento,
      idImportacao,
      liquido,
      matrizId,
      site,
      weekReference,
      value_search: "value_futebol",
      tipo_caixa: "futebol",
    });
  } catch (error) {
    console.error("create createRegisterCashierFutebol", error);
  }
};
