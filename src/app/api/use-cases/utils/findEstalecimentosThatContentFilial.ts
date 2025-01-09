import { prisma } from "@/services/prisma";
import { Caixa } from "@prisma/client";

export const findEstalecimentosThatContentFilial = async (caixa: Caixa[]) => {
  const estabelecimentos = await Promise.all(
    caixa.map(async (data) => {
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: {
          id: data.establishmentId,
        },
        select: {
          id: true,
          filiais: true,
        },
      });
      return estabelecimento;
    }),
  );

  return estabelecimentos.filter(
    (estabelecimento) =>
      estabelecimento != null && estabelecimento.filiais.length > 0,
  );
};
