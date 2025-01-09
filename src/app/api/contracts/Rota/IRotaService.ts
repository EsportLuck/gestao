import { Rota } from "@prisma/client";

export interface IRotaService {
  obterTodas(): Promise<Rota[]>;
  obterPorId(id: number): Promise<Rota | null>;
  obterPorNome(nome: string): Promise<Rota | null>;
  criar(name: string, empresa: string): Promise<any>;
  atualizar(id: number, name: string): Promise<any>;
  apagar(id: number): Promise<any>;
}
