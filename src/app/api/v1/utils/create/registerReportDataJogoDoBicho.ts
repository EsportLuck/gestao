import { createRegisterCommissionJogoDoBicho } from "./createRegisterCommissionJogoDoBicho";
import { createRegisterNet } from "./createRegisterNet";
import { createRegisterPremiosJogoDoBicho } from "./createRegisterPremiosJogoDoBicho";
import { createRegisterSales } from "./createRegisterSales";
import { createRegisterCashierBicho } from "./createRegisterCashierBicho";
import { prisma } from "@/services/prisma";

import { CicloRepository } from "@/app/api/repositories/CicloRepository";
import { CicloService } from "@/app/api/services/CicloService";
import { Prisma } from "@prisma/client";

export const registerReportDataJogoDoBicho = async (
  estabelecimentoId: number | null,
  weekReference: Date,
  site: string,
  sales: number,
  paidOut: number,
  liquido: number,
  importacaoId: number,
  matrizId: number | null,
  tx: Prisma.TransactionClient,
) => {
  try {
    const cicloRepository = new CicloRepository(tx);
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
        tx,
      ),
      createRegisterCommissionJogoDoBicho(
        estabelecimentoId,
        weekReference,
        site,
        sales,
        importacaoId,
        tx,
      ),
      createRegisterPremiosJogoDoBicho(
        estabelecimentoId,
        weekReference,
        site,
        paidOut,
        sales,
        importacaoId,
        tx,
      ),
      createRegisterNet(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importacaoId,
        tx,
      ),
      createRegisterCashierBicho(
        estabelecimentoId,
        weekReference,
        site,
        liquido,
        importacaoId,
        matrizId,
        tx,
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
