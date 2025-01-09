import { Caixa } from "@prisma/client";
import { ICaixaRepository, ICaixaService } from "../contracts/Caixa";

export class CaixaService implements ICaixaService {
  constructor(private caixaRepository: ICaixaRepository) {}
  async findById(id: number): Promise<Caixa | null> {
    return await this.caixaRepository.findById(id);
  }
  async findManyByImportacaoId(
    id: number,
  ): Promise<{ caixa: Caixa[] | undefined; error: boolean }> {
    try {
      const caixa = await this.caixaRepository.findManyByImportacaoId(id);
      if (!caixa) {
        return {
          caixa: undefined,
          error: true,
        };
      }
      return {
        caixa,
        error: false,
      };
    } catch (error) {
      console.error("Caixa Service findManyByImportacaoId", error);
      return {
        caixa: undefined,
        error: true,
      };
    }
  }
  async findManyByGteDay(
    gte: Date,
  ): Promise<{ caixa: Partial<Caixa[]> | undefined; error: boolean }> {
    try {
      const caixa: Caixa[] = await this.caixaRepository.findManyByGteDay(gte);
      if (!caixa) {
        return {
          caixa: undefined,
          error: true,
        };
      }
      return { caixa, error: false };
    } catch (error) {
      console.error("Caixa Service findManyByGteDay", error);
      return {
        caixa: undefined,
        error: true,
      };
    }
  }
  async findLastCaixaByEstabelecimentoId(
    id: number,
  ): Promise<
    { caixa: Caixa; error: false } | { caixa: undefined; error: true }
  > {
    try {
      const caixa =
        await this.caixaRepository.findLastCaixaByEstabelecimentoId(id);
      if (!caixa) {
        return {
          caixa: undefined,
          error: true,
        };
      }
      return { caixa, error: false };
    } catch (error) {
      console.error("Caixa Service findLastCaixaByEstabelecimentoId", error);
      return {
        caixa: undefined,
        error: true,
      };
    }
  }
  async findAll(): Promise<Caixa[]> {
    return await this.caixaRepository.findAll();
  }
  async create(caixa: Partial<Caixa>): Promise<void> {
    return await this.caixaRepository.create(caixa);
  }
  async update(id: number, data: Partial<Caixa>): Promise<void> {
    return await this.caixaRepository.update(id, data);
  }
}
