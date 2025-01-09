import { prisma } from "@/services/prisma";
import { findSecaoInDB } from "@/app/api/v1/utils/find/findSecaoInDB";

export const createSecao = async (secao: string, localidade?: number) => {
  if (!secao) return undefined;
  const secaoExist = await findSecaoInDB(secao);
  if (secaoExist) {
    return undefined;
  } else {
    if (localidade) {
      try {
        await prisma.secao.create({
          data: {
            name: secao,
            Localidade: {
              connect: {
                id: localidade,
              },
            },
          },
        });
      } catch (err) {
        return;
      } finally {
        await prisma.$disconnect();
      }
    } else {
      try {
        const secaoExist = await findSecaoInDB(secao);
        if (secaoExist) return;
        await prisma.secao.create({
          data: {
            name: secao,
          },
        });
      } catch (err) {
        return;
      } finally {
        await prisma.$disconnect();
      }
    }
  }
};
