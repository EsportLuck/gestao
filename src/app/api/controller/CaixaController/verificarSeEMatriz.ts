import { prisma } from "@/services/prisma";

export async function verificarSeEMatriz({ id }: { id: number }) {
  const matriz = await prisma.estabelecimento.findFirst({
    where: { id },
    select: {
      matrizId: true,
    },
  });

  return matriz?.matrizId ? true : false;
}
