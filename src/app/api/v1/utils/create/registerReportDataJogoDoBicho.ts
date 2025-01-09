import { createRegisterCommissionJogoDoBicho } from "./createRegisterCommissionJogoDoBicho";
import { createRegisterNet } from "./createRegisterNet";
import { createRegisterPremiosJogoDoBicho } from "./createRegisterPremiosJogoDoBicho";
import { createRegisterSales } from "./createRegisterSales";
import { createRegisterCashierBicho } from "./createRegisterCashierBicho";
import { prisma } from "@/services/prisma";

import { CicloRepository } from "@/app/api/repositories/CicloRepository";
import { CicloService } from "@/app/api/services/CicloService";

export const registerReportDataJogoDoBicho = async (
  estabelecimentoId: number | null,
  weekReference: Date,
  site: string,
  sales: number,
  paidOut: number,
  liquido: number,
  importacaoId: number,
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
        sales,
        0,
        importacaoId,
      ),
      createRegisterCommissionJogoDoBicho(
        estabelecimentoId,
        weekReference,
        site,
        sales,
        importacaoId,
      ),
      createRegisterPremiosJogoDoBicho(
        estabelecimentoId,
        weekReference,
        site,
        paidOut,
        sales,
        importacaoId,
      ),
      createRegisterNet(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importacaoId,
      ),
      createRegisterCashierBicho(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importacaoId,
        matrizId,
      ),
    ]);

    return { success: true, message: "Importado com sucesso" };
  } catch (error: any) {
    console.error(
      "create registerReportDataJogoDoBicho registerReportDataJogoDoBicho",
      error,
    );
    return { success: false, message: `Algo deu errado ${error.message}` };
  }
};
