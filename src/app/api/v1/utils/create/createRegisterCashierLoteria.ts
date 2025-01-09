import { prisma } from "@/services/prisma";
import { caixaStrategy } from "@/app/api/v1/utils/strategy";

export const createRegisterCashierLoteria = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  liquido: number,
  idImportacao: number,
  matrizId: number | null,
) => {
  if (!estabelecimento || !weekReference || !site || !idImportacao)
    throw new Error("Some data is missing in createRegisterCashierLoteria");
  try {
    await caixaStrategy({
      establishmentId: estabelecimento,
      idImportacao,
      liquido,
      matrizId,
      site,
      weekReference,
      value_search: "value_loteria",
      tipo_caixa: "loteria",
    });
  } catch (error) {
    console.error("create createRegisterCashierLoteria", error);
  }
};
