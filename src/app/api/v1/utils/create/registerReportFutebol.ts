import { prisma } from "@/services/prisma";
import { createRegisterCashierFutebol } from "./createRegisterCashierFutebol";
import { createRegisterCommission } from "./createRegisterCommission";
import { createRegisterNet } from "./createRegisterNet";
import { createRegisterPremios } from "./createRegisterPremios";
import { createRegisterSales } from "./createRegisterSales";
import { CicloRepository } from "@/app/api/repositories/CicloRepository";
import { CicloService } from "@/app/api/services/CicloService";
import { Caixa } from "@prisma/client";

export const registerReportFutebol = async (
  estabelecimentoId: number,
  weekReference: Date,
  site: string,
  vendas: number,
  quantidade: number,
  comissao: number,
  premios: number,
  liquido: number,
  importacaoId: number,
  matrizId: number | null,
) => {
  try {
    const cicloService = new CicloService(new CicloRepository());
    const referenceDate = new Date(weekReference);
    const { success, message } = await prisma.$transaction(
      async () => {
        const caixaExist = await prisma.caixa.findFirst({
          where: {
            establishmentId: Number(estabelecimentoId),
            referenceDate,
          },
        });
        await cicloService.criar(
          estabelecimentoId,
          new Date(weekReference),
          matrizId,
        ),
          await createRegisterSales(
            estabelecimentoId,
            weekReference,
            site,
            vendas,
            quantidade,
            importacaoId,
          ),
          await createRegisterCommission(
            estabelecimentoId,
            weekReference,
            site,
            comissao,
            importacaoId,
          ),
          await createRegisterPremios(
            estabelecimentoId,
            weekReference,
            site,
            premios,
            importacaoId,
          ),
          await createRegisterNet(
            estabelecimentoId,
            weekReference,
            site,
            liquido,
            importacaoId,
          );
        await criarRegistroDeCaixa(
          caixaExist,
          site,
          liquido,
          importacaoId,
          matrizId,
          estabelecimentoId,
          weekReference,
        );
        return { success: true, message: "Importado com sucesso" };
      },
      { timeout: 50000 },
    );
    return { success, message };
  } catch (error: any) {
    console.error("create registerReportFutebol registerReportFutebol", error);
    return {
      success: false,
      message: `Algo deu errado ao importar os dados registerReportFutebol ${error.message}`,
    };
  }
};

const criarRegistroDeCaixa = async (
  caixaExist: Caixa | null,
  site: string,
  liquido: number,
  importacaoId: number,
  matrizId: number | null,
  estabelecimentoId: number,
  weekReference: Date,
) => {
  if (!caixaExist) {
    return await createRegisterCashierFutebol(
      estabelecimentoId,
      weekReference,
      site,
      liquido,
      importacaoId,
      matrizId,
    );
  }
  const total = caixaExist.total + liquido * 100;
  const futebol = caixaExist.value_futebol || 0;
  const value_futebol = futebol + liquido * 100;
  await prisma.caixa.update({
    where: {
      id: caixaExist.id,
    },
    data: {
      total,
      futebol: site,
      value_futebol,
    },
  });
};
