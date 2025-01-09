import { Secao } from "@prisma/client";

export interface ISecaoService {
  obterTodas(): Promise<
    { secoes: Partial<Secao[]>; error: false } | { secoes: []; error: true }
  >;
  obterPorId(id: number): Promise<Secao | null>;
  obterPorNome(nome: string): Promise<Secao | null>;
  criar(name: string, empresa: string): Promise<any>;
  atualizar(id: number, name: string): Promise<any>;
  apagar(id: number): Promise<any>;
  encontrarTodasAsSecoesPorEmpresa(name: string): Promise<Secao[]>;
}
