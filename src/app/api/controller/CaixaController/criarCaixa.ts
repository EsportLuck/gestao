import { prisma } from "@/services/prisma";

export async function criarCaixa(data: {
  total: number;
  referenceDate: Date;
  site: string;
  value_search: string;
  establishmentId: number;
  tipo_caixa: string;
  idImportacao: number;
  liquido: number;
}) {
  const {
    total,
    referenceDate,
    site,
    value_search,
    establishmentId,
    tipo_caixa,
    idImportacao,
    liquido,
  } = data;

  await prisma.caixa.create({
    data: {
      total,
      referenceDate,
      [tipo_caixa]: site,
      [value_search]: liquido,
      establishment: {
        connect: { id: establishmentId },
      },
      status: "PENDENTE",
      importacao: {
        connect: { id: idImportacao },
      },
    },
  });
}
