import { prisma } from "@/services/prisma";
import { findLocalidadeInDB } from "@/app/api/v1/utils/find/findLocalidadeInDB";

export const createLocalidade = async (localidade: string) => {
  if (!localidade) return undefined;
  const localidadeExist = await findLocalidadeInDB(localidade);
  if (localidadeExist) {
    return undefined;
  } else {
    try {
      await prisma.localidade.create({
        data: {
          name: localidade,
        },
      });
    } catch (err) {
    } finally {
      await prisma.$disconnect();
    }
  }
};
