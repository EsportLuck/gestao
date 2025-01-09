import { Comissao } from "@prisma/client";
import { IComissaoRepository, IComissaoService } from "../contracts/Comissao";

export class ComissaoService implements IComissaoService {
  constructor(private comissaoRepository: IComissaoRepository) {}
  async findById(id: number): Promise<Comissao | null> {
    return await this.comissaoRepository.findById(id);
  }
  async findManyByImportacaoId(
    id: number,
  ): Promise<{ comissao: Comissao[] | undefined; error: boolean }> {
    try {
      const comissao = await this.comissaoRepository.findManyByImportacaoId(id);
      if (!comissao) {
        return {
          comissao: undefined,
          error: true,
        };
      }
      return {
        comissao,
        error: false,
      };
    } catch (error) {
      console.error("Comissao Service findManyByImportacaoId", error);
      return {
        comissao: undefined,
        error: true,
      };
    }
  }
  async findAll(): Promise<Comissao[]> {
    return await this.comissaoRepository.findAll();
  }
  async create(comissao: Partial<Comissao>): Promise<void> {
    return await this.comissaoRepository.create(comissao);
  }
  async update(id: number, data: Partial<Comissao>): Promise<void> {
    return await this.comissaoRepository.update(id, data);
  }
  async deleteManyById(id: number[]): Promise<{ error: boolean }> {
    try {
      await this.comissaoRepository.deleteManyById(id);
      return { error: false };
    } catch (error) {
      console.error("Comissao Service delete", error);
      return {
        error: true,
      };
    }
  }
}
