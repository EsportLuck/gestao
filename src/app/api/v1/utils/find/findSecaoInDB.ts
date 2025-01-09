import { prisma } from "@/services/prisma";

export const findSecaoInDB = async (localicade: string) => {
  try {
    const secao = await prisma.secao.findFirst({
      where: {
        name: localicade,
      },
    });
    return secao;
  } catch (error) {
    console.error("find findSecaoInDB findSecaoInDB", error);
  }
};
