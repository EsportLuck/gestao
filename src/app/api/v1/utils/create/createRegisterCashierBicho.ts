import { prisma } from "@/services/prisma";
import { caixaStrategy } from "@/app/api/v1/utils/strategy";

export const createRegisterCashierBicho = async (
  estabelecimento: number | null,
  weekReference: Date,
  site: string,
  liquido: number,
  idImportacao: number,
  matrizId: number | null,
) => {
  if (!estabelecimento || !weekReference || !site || !idImportacao)
    throw new Error("Some data is missing in createRegisterCashierBicho");
  try {
    await caixaStrategy({
      establishmentId: estabelecimento,
      idImportacao,
      liquido,
      matrizId,
      site,
      weekReference,
      value_search: "value_bicho",
      tipo_caixa: "bicho",
    });
  } catch (error) {
    console.error("create createRegisterCashierBicho", error);
  }
};
