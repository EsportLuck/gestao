import { Secao } from "@prisma/client";

export interface ISecaoRepository {
  obterTodas(): Promise<Secao[]>;
  obterPorId(id: number): Promise<Secao | null>;
  obterPorNome(nome: string): Promise<Secao | null>;
  criar(name: string, empresa: number | undefined): Promise<any>;
  atualizar(id: number, name: string): Promise<any>;
  apagar(id: number): Promise<any>;
  encontrarTodasAsSecoesPorEmpresa(name: string): Promise<Secao[]>;
}
