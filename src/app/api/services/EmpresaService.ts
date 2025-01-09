import { Empresa } from "@prisma/client";
import { IEmpresaRepository, IEmpresaService } from "../contracts/Empresa";

export class EmpresaService implements IEmpresaService {
  constructor(private empresaRepository: IEmpresaRepository) {}
  async obterPorNome(nome: string): Promise<Partial<Empresa> | null> {
    return await this.empresaRepository.obterPorNome(nome);
  }

  async obterTodas(): Promise<any> {
    return await this.empresaRepository.obterTodas();
  }

  async obterPorId(id: number): Promise<any> {
    return await this.empresaRepository.obterPorId(id);
  }

  async criar(nome: string): Promise<
    | {
        error: boolean;
        message: string;
      }
    | Error
  > {
    const seEmpresaExistir = await this.empresaRepository.obterPorNome(nome);
    if (seEmpresaExistir) {
      throw new Error("Esta empresa já existe");
    }
    const criarEmpresa = await this.empresaRepository.criar(nome);
    if (criarEmpresa.error) {
      throw new Error(criarEmpresa.message);
    }
    return criarEmpresa;
  }

  async atualizar(id: number, nome: string): Promise<any> {
    return await this.empresaRepository.atualizar(id, nome);
  }

  async apagar(id: number): Promise<any> {
    return await this.empresaRepository.apagar(id);
  }
}
