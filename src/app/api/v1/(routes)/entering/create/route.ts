import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";
import { findEstabelecimentoInDB } from "@/app/api/v1/utils/find";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.formData();
  const tipo = data.get("tipo") as
    | "despesa"
    | "pagamento"
    | "recebimento"
    | undefined;
  const forma_pagamento = data.get("forma_pagamento") as
    | "dinheiro"
    | "pix"
    | undefined;
  const estabelecimento = data.get("estabelecimentoId");
  const value = Number(data.get("valor"));
  const observacao_comprovante = data.get("observacao_comprovante") as string;
  const recorded_by = data.get("user") as string;
  const data_reference = new Date(data.get("date_reference") as string);
  const estabelecimentoId = await findEstabelecimentoInDB(
    estabelecimento as string,
  );
  const comprovante = data.get("comprovante") as File;

  if (
    !tipo ||
    !forma_pagamento ||
    !estabelecimentoId ||
    !value ||
    !observacao_comprovante ||
    !recorded_by ||
    !data_reference ||
    !comprovante
  )
    return NextResponse.json({ status: 500, message: "Dados inválidos" });

  const dataLancamento = {
    data_reference,
    forma_pagamento,
    observacao_comprovante,
    value,
    tipo,
    estabelecimentoId: estabelecimentoId.id,
    recorded_by,
    comprovante,
  };
  try {
    const { message } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          username: recorded_by,
        },
      });
      if (!user?.username) return { message: "Usuário não permitido" };
      const lancamento = new Entering(dataLancamento);
      const { message } = await lancamento.create();

      return { message };
    });
    if (message !== "Lançamento criado com sucesso")
      return NextResponse.json({ status: 500, message });
    return NextResponse.json({ status: 201, message });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Erro interno do servidor",
    });
  }
}
