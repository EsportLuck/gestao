import { prisma } from "@/services/prisma";
import { Rota } from "@prisma/client";
import { IRotaRepository } from "../contracts/Rota";

export class RotaRepository implements IRotaRepository {
  async obterTodas(): Promise<Rota[]> {
    return await prisma.rota.findMany();
  }

  async obterPorId(id: number): Promise<Rota | null> {
    return await prisma.rota.findUnique({
      where: {
        id,
      },
    });
  }

  async obterPorNome(nome: string): Promise<Rota | null> {
    return await prisma.rota.findUnique({
      where: {
        name: nome,
      },
    });
  }

  async criar(name: string, empresa: number | undefined): Promise<any> {
    return await prisma.rota.create({
      data: {
        name: name,
        empresaId: empresa,
      },
    });
  }

  async atualizar(id: number, name: string): Promise<any> {
    return await prisma.rota.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });
  }

  async apagar(id: number): Promise<any> {
    return await prisma.rota.delete({
      where: {
        id,
      },
    });
  }
}
