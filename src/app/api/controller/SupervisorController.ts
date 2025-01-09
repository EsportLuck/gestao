import { prisma } from "@/services/prisma";

interface IDataUpdate {
  name?: string;
  Localidade?: { connect: { id: string } };
  Secao?: { connect: { id: string } };
  updatedAt: Date;
}
type InputData = {
  name: string | null;
  localidade: string | null;
  secao: string | null;
};
function construirDadosAtualizacao(data: InputData): any {
  const { name, localidade, secao } = data;

  return {
    ...(name && { name }),
    ...(localidade && { Localidade: localidade }),
    ...(secao && { Secao: secao }),
    ...{ updatedAt: new Date() },
  };
}

export class SupervisorController {
  constructor() {}

  async update(id: number, dados: InputData) {
    const data = construirDadosAtualizacao(dados);

    try {
      await prisma.supervisor.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.error("Error updating supervisor:", error);
    } finally {
      await prisma.$disconnect();
    }
  }

  async findMany() {}

  async findUnique(id: number) {}
}
