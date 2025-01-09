import { Liquido, Vendas, Comissao, Premios } from "@prisma/client";

export const getId = (
  data: Liquido[] | Vendas[] | Comissao[] | Premios[],
): number[] => {
  return data.map((data) => data.id);
};
