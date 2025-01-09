import {
  ICronJobCriarCaixaDiarioRepository,
  ICronJobCriarCaixaDiarioService,
} from "@/app/api/contracts";
import { CaixaService, EstabelecimentoService } from ".";
import { prisma } from "@/services/prisma";
export class CronJobCriarCaixaDiarioService
  implements ICronJobCriarCaixaDiarioService
{
  private cronJobCriaCaixaDiarioRepository: ICronJobCriarCaixaDiarioRepository;
  private estabelecimentoService: EstabelecimentoService;
  private caixaService: CaixaService;
  constructor(
    cronJobCriaCaixaDiarioRepository: ICronJobCriarCaixaDiarioRepository,
    estabelecimentoService: EstabelecimentoService,
    caixaService: CaixaService,
  ) {
    this.cronJobCriaCaixaDiarioRepository = cronJobCriaCaixaDiarioRepository;
    this.estabelecimentoService = estabelecimentoService;
    this.caixaService = caixaService;
  }
  async executarCronjobCaixa(date = new Date()): Promise<
    | {
        success: true;
        message: "Caixas Criados com sucesso" | "Primeira execução";
      }
    | { success: false; message: "Caixa já criados" }
  > {
    const ultimaExecução =
      await this.cronJobCriaCaixaDiarioRepository.verificarUltimaExecucao();
    if (ultimaExecução?.id === null) {
      await this.cronJobCriaCaixaDiarioRepository.criarCronjob("CRIAR CAIXA");
      return { success: true, message: "Primeira execução" };
    }

    if (ultimaExecução?.date?.getUTCDate() === date.getUTCDate()) {
      return { success: false, message: "Caixa já criados" };
    }

    const todosEstabelecimentos =
      await this.estabelecimentoService.encontrarTodosOsEstabelecimentos();
    for await (const estabelecimento of todosEstabelecimentos.estabelecimento) {
      const id = estabelecimento?.id as number;
      const { caixa: lastCaixa, error } =
        await this.caixaService.findLastCaixaByEstabelecimentoId(id);
      if (error) {
        continue;
      }
      const data = {
        total: lastCaixa?.total ? lastCaixa?.total : 0,
        referenceDate: date,
        status: "PENDENTE",
        establishmentId: id,
      };
      await prisma.caixa.create({
        data,
      });
    }
    await this.cronJobCriaCaixaDiarioRepository.criarCronjob(
      "CRIAR CAIXA",
      date,
    );

    return { success: true, message: "Caixas Criados com sucesso" };
  }
}
