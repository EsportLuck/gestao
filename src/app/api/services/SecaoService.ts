import { ISecaoRepository, ISecaoService } from "@/app/api/contracts/Secao";
import { prisma } from "@/services/prisma";
import { Secao } from "@prisma/client";

export class SecaoService implements ISecaoService {
  constructor(private secaoRepository: ISecaoRepository) {}
  async obterTodas(): Promise<
    { secoes: Partial<Secao[]>; error: false } | { secoes: []; error: true }
  > {
    try {
      const secoes = await this.secaoRepository.obterTodas();
      if (secoes.length === 0) {
        return { secoes: [], error: true };
      }
      return { secoes, error: false };
    } catch (error) {
      console.error("SecaoService obterTodas", error);
      return { secoes: [], error: true };
    } finally {
      await prisma.$disconnect();
    }
  }
  async obterPorId(id: number): Promise<Secao | null> {
    return this.secaoRepository.obterPorId(id);
  }
  async obterPorNome(nome: string): Promise<Secao | null> {
    return this.secaoRepository.obterPorNome(nome);
  }
  async criar(name: string, empresa: string): Promise<any> {
    try {
      const empresaName = await prisma.empresa.findUnique({
        where: {
          name: empresa,
        },
      });
      const secaoExiste = await this.obterPorNome(name);
      if (!secaoExiste) {
        return this.secaoRepository.criar(name, empresaName?.id);
      }
      return;
    } catch (error) {
      console.error("SecaoService criar", error);
    }
  }
  async atualizar(id: number, name: string): Promise<any> {
    return this.secaoRepository.atualizar(id, name);
  }
  async apagar(id: number): Promise<any> {
    return this.secaoRepository.apagar(id);
  }

  async encontrarTodasAsSecoesPorEmpresa(name: string): Promise<Secao[]> {
    return this.secaoRepository.encontrarTodasAsSecoesPorEmpresa(name);
  }
}
