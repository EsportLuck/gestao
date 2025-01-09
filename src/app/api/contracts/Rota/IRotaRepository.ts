import { Rota } from "@prisma/client";

export interface IRotaRepository {
  obterTodas(): Promise<Rota[]>;
  obterPorId(id: number): Promise<Rota | null>;
  obterPorNome(nome: string): Promise<Rota | null>;
  criar(name: string, empresa: number | undefined): Promise<any>;
  atualizar(id: number, name: string): Promise<any>;
  apagar(id: number): Promise<any>;
}
