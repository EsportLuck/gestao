import { prisma } from "@/services/prisma";

export const findEstabelecimentoInDB = async (estabelecimento: string) => {
  try {
    const estabelecimentoExist = await prisma.estabelecimento.findFirst({
      where: {
        name: estabelecimento,
      },
      select: {
        id: true,
        name: true,
        matrizId: true,
      },
    });
    return estabelecimentoExist;
  } catch (error) {
    console.error("find findEstabelecimentoDB findEstabelecimentoDB", error);
  }
};
