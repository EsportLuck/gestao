import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest): Promise<void | Response> {
  try {
    const tipo = req.nextUrl.searchParams.get("tipo");
    if (typeof tipo !== "string") {
      return NextResponse.json({ message: "Tipo inválido" }, { status: 400 });
    }

    const { success, message, data } = await prisma.$transaction(async (tx) => {
      const lancamentos = await tx.lancamentos.findMany({
        where: {
          status: tipo,
        },
        select: {
          establishment: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          createdAt: true,
          type: true,
          observation: true,
          paymentMethod: true,
          value: true,
          referenceDate: true,
          status: true,
          url: true,
          downloadUrl: true,
          recorded_by: true,
          id_ciclo: true,
        },
      });
      const data = lancamentos.map((items) => {
        return {
          id: items.id,
          status: items.status,
          data: items.referenceDate,
          valor: items.value / 100,
          url: items.url,
          downloadUrl: items.downloadUrl,
          responsavel: items.recorded_by,
          estabelecimento: items.establishment.name,
          tipo: items.type,
          estabelecimento_id: items.establishment.id,
          forma_pagamento: items.paymentMethod,
          observacoes: items.observation,
          id_ciclo: items.id_ciclo,
        };
      });
      return {
        success: true,
        message: "Lancamentos obtidos com sucesso",
        data,
      };
    });
    if (!success) {
      return NextResponse.json({ message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
