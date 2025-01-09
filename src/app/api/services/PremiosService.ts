import { Premios } from "@prisma/client";
import { IPremiosService, IPremiosRepository } from "../contracts/Premios";

export class PremiosService implements IPremiosService {
  constructor(private readonly repository: IPremiosRepository) {}

  async findById(id: number): Promise<Premios | null> {
    return await this.repository.findById(id);
  }
  async findManyByImportacaoId(
    id: number,
  ): Promise<{ premios: Premios[] | undefined; error: boolean }> {
    try {
      const premios = await this.repository.findManyByImportacaoId(id);
      if (!premios) {
        return {
          premios: undefined,
          error: true,
        };
      }
      return {
        premios,
        error: false,
      };
    } catch (error) {
      console.error("Premios Service findManyByImportacaoId", error);
      return {
        premios: undefined,
        error: true,
      };
    }
  }
  async findAll(): Promise<Premios[]> {
    return await this.repository.findAll();
  }
  async create(data: Premios): Promise<void> {
    await this.repository.create(data);
  }
  async update(id: number, data: Partial<Premios>): Promise<void> {
    await this.repository.update(id, data);
  }
  async deleteManyById(id: number[]): Promise<{ error: boolean }> {
    try {
      await this.repository.deleteManyById(id);
      return {
        error: false,
      };
    } catch (error) {
      console.error("Premios Service deleteManyById", error);
      return {
        error: true,
      };
    }
  }
}
