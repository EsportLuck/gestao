import { prisma } from "@/services/prisma";
import { IEmpresaRepository } from "../contracts/Empresa";
import { Empresa } from "@prisma/client";
import { E } from "vitest/dist/chunks/environment.C5eAp3K6.js";

export class EmpresaRepository implements IEmpresaRepository {
  async obterPorNome(nome: string): Promise<Partial<Empresa> | null> {
    return await prisma.empresa.findUnique({
      where: {
        name: nome,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
  async obterTodas(): Promise<Partial<Empresa>[]> {
    return await prisma.empresa.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
  async obterPorId(id: number): Promise<Partial<Empresa> | null> {
    return await prisma.empresa.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
  async criar(nome: string): Promise<{ error: boolean; message: string }> {
    try {
      await prisma.empresa.create({
        data: {
          name: nome,
        },
      });
      return { error: false, message: "Empresa criada com sucesso" };
    } catch (error) {
      return { error: true, message: "Erro ao criar empresa" };
    }
  }
  async atualizar(id: number, nome: string): Promise<void> {
    try {
      await prisma.empresa.update({
        where: {
          id: id,
        },
        data: {
          name: nome,
        },
      });
    } catch (error) {}
  }
  async apagar(id: number): Promise<void> {
    await prisma.empresa.delete({
      where: {
        id: id,
      },
    });
  }

  async apagarPeloNome(nome: string): Promise<void> {
    await prisma.empresa.deleteMany({
      where: {
        name: nome,
      },
    });
  }
}
