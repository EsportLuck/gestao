import { prisma } from "@/services/prisma";
import {
  LiquidoRepository,
  VendasRepository,
  ComissaoRepository,
  CaixaRepository,
  PremiosRepository,
} from "@/app/api/repositories";
import {
  CaixaService,
  ComissaoService,
  LiquidoService,
  PremiosService,
  VendasService,
} from "@/app/api/services";

export const getImportacaoData = async (
  idImportacao: number,
  weekReference: Date,
) => {
  const liquidoService = new LiquidoService(new LiquidoRepository());
  const vendasService = new VendasService(new VendasRepository());
  const comissaoService = new ComissaoService(new ComissaoRepository());
  const caixaService = new CaixaService(new CaixaRepository());
  const premiosService = new PremiosService(new PremiosRepository());
  try {
    const [AllLiquidos, AllVendas, AllComissao, AllCaixa, AllPremios] =
      await Promise.all([
        await liquidoService.findManyByImportacaoId(idImportacao),
        await vendasService.findManyByImportacaoId(idImportacao),
        await comissaoService.findManyByImportacaoId(idImportacao),
        await caixaService.findManyByGteDay(weekReference),
        await premiosService.findManyByImportacaoId(idImportacao),
      ]);
    return { AllLiquidos, AllVendas, AllComissao, AllCaixa, AllPremios };
  } catch (error) {
    console.error("getImportacaoData", error);
  }
};
