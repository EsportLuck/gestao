import { Localidade } from "@prisma/client";
import {
  ILocalidadeRepository,
  ILocalidadeService,
} from "../contracts/Localidade";
import { prisma } from "@/services/prisma";
export class LocalidadeService implements ILocalidadeService {
  constructor(private localidadeRepository: ILocalidadeRepository) {}

  async criar(name: string, empresa: string): Promise<void> {
    try {
      const empresaName = await prisma.empresa.findUnique({
        where: { name: empresa },
      });
      const localidadeExiste = await this.encontrarPorNome(name);
      if (!localidadeExiste) {
        await this.localidadeRepository.criar(name, empresaName?.id);
      }
      return;
    } catch (error) {
      console.error("LocalidadeService criar", error);
    }
  }
  async editar(localidadeId: number, name: string): Promise<void> {
    await this.localidadeRepository.editar(localidadeId, name);
  }
  async encontrarPorId(localidadeId: number): Promise<Localidade | null> {
    return this.localidadeRepository.encontrarPorId(localidadeId);
  }
  async encontrarPorNome(localidadeNome: string): Promise<Localidade | null> {
    return this.localidadeRepository.encontrarPorNome(localidadeNome);
  }
  async encontrarTodasAsLocalidade(): Promise<
    | { localidade: Partial<Localidade[]>; error: false }
    | { localidade: []; error: true }
  > {
    try {
      const localidades =
        await this.localidadeRepository.encontrarTodasAsLocalidade();
      if (localidades.length > 0) {
        return { localidade: localidades, error: false };
      }
      return { localidade: [], error: true };
    } catch (error) {
      console.error("LocalidadeService encontrar todas as localidades");
      return { localidade: [], error: true };
    } finally {
      await prisma.$disconnect();
    }
  }
  async encontrarTodasAsLocalidadesPorEmpresa(
    name: string,
  ): Promise<Localidade[]> {
    return this.localidadeRepository.encontrarTodasAsLocalidadesPorEmpresa(
      name,
    );
  }
}
