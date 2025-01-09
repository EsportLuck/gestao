import { Rota } from "@prisma/client";
import { IRotaService, IRotaRepository } from "../contracts/Rota";

export class RotaService implements IRotaService {
  constructor(private rotaRepository: IRotaRepository) {}
  obterTodas(): Promise<Rota[]> {
    return this.rotaRepository.obterTodas();
  }
  obterPorId(id: number): Promise<Rota | null> {
    return this.rotaRepository.obterPorId(id);
  }
  obterPorNome(nome: string): Promise<Rota | null> {
    return this.rotaRepository.obterPorNome(nome);
  }
  async criar(name: string, empresa: string): Promise<any> {
    const empresaName = await this.obterPorNome(empresa);
    return this.rotaRepository.criar(name, empresaName?.id);
  }
  atualizar(id: number, name: string): Promise<any> {
    return this.rotaRepository.atualizar(id, name);
  }
  apagar(id: number): Promise<any> {
    return this.rotaRepository.apagar(id);
  }
}
