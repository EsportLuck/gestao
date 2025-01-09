import { Liquido } from "@prisma/client";
import { ILiquidoRepository, ILiquidoService } from "../contracts/Liquido";

export class LiquidoService implements ILiquidoService {
  constructor(private liquidoRepository: ILiquidoRepository) {}
  async findById(id: number): Promise<Liquido | null> {
    return await this.liquidoRepository.findById(id);
  }
  async findManyByImportacaoId(
    id: number,
  ): Promise<{ liquido: Liquido[] | undefined; error: boolean }> {
    try {
      const liquido = await this.liquidoRepository.findManyByImportacaoId(id);
      if (!liquido) {
        return {
          liquido: undefined,
          error: true,
        };
      }
      return {
        liquido,
        error: false,
      };
    } catch (error) {
      console.error("Liquido Service findManyByImportacaoId", error);
      return {
        liquido: undefined,
        error: true,
      };
    }
  }
  async findAll(): Promise<Liquido[]> {
    return await this.liquidoRepository.findAll();
  }
  async create(liquido: Partial<Liquido>): Promise<void> {
    return await this.liquidoRepository.create(liquido);
  }
  async update(id: number, data: Partial<Liquido>): Promise<void> {
    return await this.liquidoRepository.update(id, data);
  }
  async deleteManyById(id: number[]): Promise<{ error: boolean }> {
    try {
      await this.liquidoRepository.deleteManyById(id);
      return { error: false };
    } catch (error) {
      console.error("Liquido Service delete", error);
      return {
        error: true,
      };
    }
  }
}
