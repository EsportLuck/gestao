import { Empresa } from "@prisma/client";

export interface IEmpresaService {
  obterTodas(): Promise<Partial<Empresa>[]>;
  obterPorId(id: number): Promise<Partial<Empresa> | null>;
  obterPorNome(nome: string): Promise<Partial<Empresa> | null>;
  criar(nome: string): Promise<any>;
  atualizar(id: number, nome: string): Promise<any>;
  apagar(id: number): Promise<any>;
}
