import { prisma } from "@/services/prisma";
import { createRegisterCashierLoteria } from "./createRegisterCashierLoteria";
import { createRegisterCommission } from "./createRegisterCommission";
import { createRegisterNet } from "./createRegisterNet";
import { createRegisterPremios } from "./createRegisterPremios";
import { createRegisterSales } from "./createRegisterSales";
import { CicloRepository } from "@/app/api/repositories/CicloRepository";
import { CicloService } from "@/app/api/services/CicloService";

export const registerReportLoteria = async (
  estabelecimentoId: number,
  weekReference: Date,
  site: string,
  vendas: number,
  comissao: number,
  premios: number,
  liquido: number,
  importedId: number,
  matrizId: number | null,
) => {
  try {
    const cicloRepository = new CicloRepository();
    const cicloService = new CicloService(cicloRepository);
    await Promise.all([
      cicloService.criar(
        estabelecimentoId as number,
        new Date(weekReference),
        matrizId,
      ),
      createRegisterSales(
        estabelecimentoId,
        weekReference,
        site,
        vendas,
        0,
        importedId,
      ),
      createRegisterCashierLoteria(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importedId,
        matrizId,
      ),
      createRegisterCommission(
        estabelecimentoId,
        weekReference,
        site,
        comissao,
        importedId,
      ),
      createRegisterPremios(
        estabelecimentoId,
        weekReference,
        site,
        premios,
        importedId,
      ),
      createRegisterNet(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importedId,
      ),
    ]);
    return { success: true, message: "Importado com sucesso" };
  } catch (error) {
    console.error("create registerReportLoteria registerReportLoteria", error);
    return {
      success: false,
      message: "Algo deu errado ao importar os dados registerReportLoteria",
    };
  }
};
