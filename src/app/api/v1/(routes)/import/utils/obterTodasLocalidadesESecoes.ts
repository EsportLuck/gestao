import { prisma } from "@/services/prisma";

export const obterTodasLocalidadesESecoes = async () => {
  const [localidades, secoes] = await prisma.$transaction([
    prisma.localidade.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.secao.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return {
    todasLocalidades: localidades,
    todasSecoes: secoes,
  };
};
