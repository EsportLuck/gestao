import { Vendas } from "@prisma/client";
import { IVendasRepository, IVendasService } from "../contracts";

export class VendasService implements IVendasService {
  constructor(private vendasRepository: IVendasRepository) {}
  async findById(id: number): Promise<Vendas | null> {
    return await this.vendasRepository.findById(id);
  }
  async findManyByImportacaoId(
    id: number,
  ): Promise<{ vendas: Vendas[] | undefined; error: boolean }> {
    try {
      const vendas = await this.vendasRepository.findManyByImportacaoId(id);
      if (!vendas) {
        return {
          vendas: undefined,
          error: true,
        };
      }
      return {
        vendas,
        error: false,
      };
    } catch (error) {
      console.error("Vendas Service findManyByImportacaoId", error);
      return {
        vendas: undefined,
        error: true,
      };
    }
  }
  async findAll(): Promise<Vendas[]> {
    return await this.vendasRepository.findAll();
  }
  async create(vendas: Partial<Vendas>): Promise<void> {
    return await this.vendasRepository.create(vendas);
  }
  async update(id: number, data: Partial<Vendas>): Promise<void> {
    return await this.vendasRepository.update(id, data);
  }
  async deleteManyById(id: number[]): Promise<{ error: boolean }> {
    try {
      await this.vendasRepository.deleteManyById(id);
      return { error: false };
    } catch (error) {
      console.error("Vendas Service delete", error);
      return {
        error: true,
      };
    }
  }
}
