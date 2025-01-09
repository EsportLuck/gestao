import { Empresa } from "@prisma/client";

export interface IEmpresaRepository {
  obterTodas(): Promise<Partial<Empresa>[]>;
  obterPorId(id: number): Promise<Partial<Empresa> | null>;
  obterPorNome(nome: string): Promise<Partial<Empresa> | null>;
  criar(nome: string): Promise<{ error: boolean; message: string }>;
  atualizar(id: number, nome: string): Promise<void>;
  apagar(id: number): Promise<void>;
  apagarPeloNome(nome: string): Promise<void>;
}
