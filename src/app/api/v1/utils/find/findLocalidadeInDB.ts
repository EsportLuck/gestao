import { prisma } from "@/services/prisma";

export const findLocalidadeInDB = async (localicade: string) => {
  try {
    const localidade = await prisma.localidade.findFirst({
      where: {
        name: localicade,
      },
    });
    return localidade;
  } catch (error) {
    console.error("find findLocalidadeInDB findLocalidadeInDB", error);
  }
};
