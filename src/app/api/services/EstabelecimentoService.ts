import { Estabelecimento } from "@prisma/client";
import {
  IEstabelecimentoRepository,
  IEstabelecimentoService,
  EstabelecimentoComLocalidadeSeção,
  EstabelecimentoSelecionado,
} from "../contracts/Estabelecimento";

export class EstabelecimentoService implements IEstabelecimentoService {
  constructor(private estabelecimentoRepository: IEstabelecimentoRepository) {}
  async criar(data: EstabelecimentoComLocalidadeSeção): Promise<void> {
    try {
      const estabelecimentoExiste =
        await this.estabelecimentoRepository.encontrarPorNome(
          data.name as string,
        );
      if (!estabelecimentoExiste) {
        await this.estabelecimentoRepository.criar(data);
      }
      return;
    } catch (error) {
      console.error("EstabelecimentoService criar", error);
    }
  }
  async editar(
    estabelecimentoId: number,
    data: Partial<Estabelecimento>,
  ): Promise<void> {
    await this.estabelecimentoRepository.editar(estabelecimentoId, data);
  }
  async encontrarPorId(
    estabelecimentoId: number,
  ): Promise<Estabelecimento | null> {
    return this.estabelecimentoRepository.encontrarPorId(estabelecimentoId);
  }
  async encontrarPorNome(
    estabelecimentoNome: string,
  ): Promise<EstabelecimentoSelecionado | null> {
    return this.estabelecimentoRepository.encontrarPorNome(estabelecimentoNome);
  }
  async encontrarMuitosEstabelecimentosPorSite(
    site: string,
  ): Promise<EstabelecimentoSelecionado[] | null> {
    return this.estabelecimentoRepository.encontrarMuitosEstabelecimentosPorSite(
      site,
    );
  }
  async encontrarMuitosEstabelecimentosPorEmpresa(
    empresa: string,
  ): Promise<EstabelecimentoSelecionado[] | null> {
    return this.estabelecimentoRepository.encontrarMuitosEstabelecimentosPorEmpresa(
      empresa,
    );
  }
  async encontrarTodosOsEstabelecimentos(): Promise<
    | { estabelecimento: Partial<Estabelecimento[]>; error: false }
    | { estabelecimento: []; error: true }
  > {
    try {
      const estabelecimento =
        await this.estabelecimentoRepository.encontrarTodosOsEstabelecimentos();
      if (estabelecimento.length > 0) {
        return { estabelecimento, error: false };
      }
      return { estabelecimento: [], error: true };
    } catch (error) {
      console.error(
        "EstabelecimentoService encontrar todas as estabelecimentos",
      );
      return { estabelecimento: [], error: true };
    }
  }
}
