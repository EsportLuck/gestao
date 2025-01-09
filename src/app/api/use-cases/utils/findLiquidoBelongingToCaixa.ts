import { Caixa, Liquido } from "@prisma/client";

export const findLiquidoBelongingToCaixa = (
  caixa: Caixa[],
  liquido: Liquido[],
) => {
  return caixa.map((caixa) => {
    const liquidoCorrespondenteAoCaixa = liquido.filter((liquido) => {
      return liquido.establishmentId === caixa.establishmentId;
    });
    const sumLiquidoCorrespondenteAoCaixa =
      liquidoCorrespondenteAoCaixa[0]?.value | 0;
    return {
      caixa,
      liquidoCorrespondenteAoCaixa: sumLiquidoCorrespondenteAoCaixa,
    };
  });
};
