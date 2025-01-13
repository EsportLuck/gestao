import { CaixaController } from "@/app/api/controller";
import { seNaoExistiValorRetornarZero } from "@/utils";
import { Prisma } from "@prisma/client";

export async function atualizarCaixaMatriz(
  matrizId: number | null,
  gte: Date,
  lte: Date,
  value_search: string,
  liquido: number,
  tx: Prisma.TransactionClient,
) {
  if (matrizId === null) return;
  const caixaController = new CaixaController(tx);
  const caixaMatriz = await caixaController.encontrarCaixaDaMatriz({
    id: matrizId,
    gte,
    lte,
    value_search,
  });
  const caixaMatrizNaoExiste = caixaMatriz === null;
  if (caixaMatrizNaoExiste) return false;

  const valueProduto = caixaMatriz[value_search]
    ? seNaoExistiValorRetornarZero(caixaMatriz[value_search])
    : 0;
  const totalDeCaixa = Number((liquido * 100).toFixed(0)) + caixaMatriz?.total;
  const searchTotal = Number((liquido * 100).toFixed(0)) + valueProduto;

  await caixaController.atualizarCaixa(
    caixaMatriz.id,
    totalDeCaixa,
    value_search,
    searchTotal,
  );
  return true;
}
