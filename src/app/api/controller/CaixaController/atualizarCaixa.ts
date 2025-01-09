import { prisma } from "@/services/prisma";

export async function atualizarCaixa(
  id: number | undefined,
  total: number,
  value_search: string,
  searchTotal: number,
) {
  if (id === undefined) return null;

  await prisma.caixa.update({
    where: { id },
    data: {
      total,
      [value_search]: searchTotal,
    },
  });
}
