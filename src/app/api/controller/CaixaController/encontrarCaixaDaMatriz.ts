import { prisma } from "@/services/prisma";

interface IEncontrarCaixaDaMatriz {
  id: number | null;
  gte: Date;
  lte: Date;
  value_search: any;
}

export async function encontrarCaixaDaMatriz({
  id,
  gte,
  lte,
  value_search,
}: IEncontrarCaixaDaMatriz): Promise<{
  id: number;
  total: number;
  [key: string]: any;
} | null> {
  if (!id || !gte || !lte || !value_search)
    throw new Error(
      `Some data is missing in encontrarCaixaDaMatriz id: ${id} gte: ${gte} lte: ${lte} value_search: ${value_search}`,
    );
  try {
    const maiorQue = new Date(new Date(gte).setUTCHours(0, 0, 0, 0));
    const menorQue = new Date(new Date(lte).setUTCHours(23, 59, 59, 999));

    return await prisma.caixa.findFirst({
      where: {
        establishmentId: {
          equals: id,
        },
        AND: {
          referenceDate: { gte: maiorQue, lte: menorQue },
        },
      },
      select: {
        id: true,
        total: true,
        [value_search]: true,
      },
    });
  } catch (error) {
    return null;
    console.error("encontrarCaixaDaMatriz", error);
  }   
}
