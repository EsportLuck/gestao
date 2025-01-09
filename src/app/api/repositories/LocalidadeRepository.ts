import { ILocalidadeRepository } from "@/app/api/contracts/Localidade";
import { prisma } from "@/services/prisma";
import { Localidade } from "@prisma/client";

export class LocalidadeRepository implements ILocalidadeRepository {
  async criar(name: string, empresaId: number): Promise<void> {
    await prisma.localidade.create({
      data: {
        name,
        empresaId,
      },
    });
  }
  async editar(localidadeId: number, name: string): Promise<void> {
    await prisma.localidade.update({
      where: {
        id: localidadeId,
      },
      data: {
        name,
      },
    });
  }
  async encontrarPorId(localidadeId: number): Promise<Localidade | null> {
    return await prisma.localidade.findUnique({
      where: {
        id: localidadeId,
      },
    });
  }

  async encontrarPorNome(localidadeNome: string): Promise<Localidade | null> {
    return await prisma.localidade.findUnique({
      where: {
        name: localidadeNome,
      },
    });
  }
  async encontrarTodasAsLocalidade(): Promise<Localidade[] | []> {
    return await prisma.localidade.findMany();
  }
  async encontrarTodasAsLocalidadesPorEmpresa(
    name: string,
  ): Promise<Localidade[]> {
    return await prisma.localidade.findMany({
      where: {
        empresa: {
          name,
        },
      },
    });
  }
}
