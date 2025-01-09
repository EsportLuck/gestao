import { prisma } from "@/services/prisma";
import {
  LiquidoRepository,
  VendasRepository,
  ComissaoRepository,
  PremiosRepository,
} from "@/app/api/repositories";
import {
  LiquidoService,
  VendasService,
  ComissaoService,
  PremiosService,
} from "@/app/api/services";

export const deleteImportacao = async (
  liquido: number[],
  vendas: number[],
  comissao: number[],
  premios: number[],
) => {
  const liquidoService = new LiquidoService(new LiquidoRepository());
  const vendasService = new VendasService(new VendasRepository());
  const comissaoService = new ComissaoService(new ComissaoRepository());
  const premiosService = new PremiosService(new PremiosRepository());
  try {
    await Promise.all([
      await liquidoService.deleteManyById(liquido),
      await vendasService.deleteManyById(vendas),
      await comissaoService.deleteManyById(comissao),
      await premiosService.deleteManyById(premios),
    ]);
  } catch (error) {
    console.error("deleteImportacao", error);
  }
};
