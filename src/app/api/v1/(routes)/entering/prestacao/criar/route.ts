import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { Prisma } from "@prisma/client";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<Response> {
  try {
    const formData = await req.formData();
    const prestacaoData = obterFormDataDaPrestacao(formData);

    if (!isValidPrestacaoData(prestacaoData)) {
      return NextResponse.json({
        status: 400,
        message: "Faltam dados obrigatórios para criar o lançamento.",
      });
    }

    const { message, status } = await prisma.$transaction(async (tx) => {
      const userDB = await tx.user.findUnique({
        where: { username: prestacaoData.user },
        select: { username: true },
      });
      if (!userDB?.username) {
        return {
          status: 400,
          message: "Usuário não encontrado",
        };
      }
      let uploadResult = null;
      if (prestacaoData.file && typeof prestacaoData.file !== "string") {
        uploadResult = await put(prestacaoData.file.name, prestacaoData.file, {
          access: "public",
        });
      }
      const estabelecimento = await tx.estabelecimento.findUnique({
        where: { id: prestacaoData.estabelecimentoId },
        select: {
          empresaId: true,
        },
      });
      if (!estabelecimento?.empresaId) {
        return {
          status: 400,
          message: "Estabelecimento não encontrado",
        };
      }
      const lancamentoData: Prisma.LancamentosCreateInput = {
        downloadUrl: uploadResult?.downloadUrl ?? "",
        url: uploadResult?.url ?? "",
        paymentMethod: prestacaoData.paymentMethod,
        status: "analise",
        type: "prestação",
        value: convertToMinorUnit(prestacaoData.valor),
        recorded_by: userDB?.username,
        referenceDate: new Date(prestacaoData.date),
        id_ciclo: prestacaoData.ciclo,
        establishment: {
          connect: {
            id: prestacaoData.estabelecimentoId,
          },
        },
        empresa: {
          connect: {
            id: estabelecimento.empresaId,
          },
        },
      };

      const lancamento = await tx.lancamentos.create({ data: lancamentoData });
      if (lancamento) {
        return { status: 201, message: "Lancamento criado com sucesso" };
      }
      return { status: 500, message: "Erro ao criar lancamento" };
    });

    return NextResponse.json({ status, message });
  } catch (error) {
    console.error("deposit prestação post", error);
    if (error instanceof Error && error.message === "Usuário não encontrado") {
      return NextResponse.json({ status: 401, message: error.message });
    }
    return NextResponse.json({
      status: 500,
      message: "Erro interno do servidor",
    });
  }
}

function isValidPrestacaoData(data: FormDataResult): boolean {
  return Boolean(
    data.user && data.date && data.valor && data.ciclo && data.data_pagamento,
  );
}

function convertToMinorUnit(valor: number): number {
  return Number((valor * 100).toFixed(0));
}
interface FormDataResult {
  date: string;
  valor: number;
  ciclo: number;
  data_pagamento: string | null;
  file: File;
  user: string;
  paymentMethod: string;
  estabelecimentoId: number;
}
function obterFormDataDaPrestacao(formData: FormData): FormDataResult {
  const data: Record<string, FormDataEntryValue | File> = Object.fromEntries(
    formData.entries(),
  );

  return {
    date: data.date as string,
    valor: Number(data.valor),
    ciclo: Number(data.ciclo),
    data_pagamento: data.data_pagamento
      ? (data.data_pagamento as string)
      : null,
    file: data.file as File,
    user: data.user as string,
    paymentMethod: data.tipo_pagamento as string,
    estabelecimentoId: Number(data.estabelecimentoId),
  };
}
