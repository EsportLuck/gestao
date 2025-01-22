import { prisma } from "@/services/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const { change, establishmentId } = data;
    const { success, message } = await prisma.$transaction(async (tx) => {
      const mudarStatusDeComissao = await tx.estabelecimento.update({
        where: {
          id: establishmentId,
        },
        data: {
          comissao_retida: change,
        },
      });
      if (typeof mudarStatusDeComissao?.id !== "number") {
        return { success: false, message: "Estabelecimento não encontrado" };
      }

      const comissoes = await tx.comissao.findMany({
        where: {
          establishmentId,
        },
      });

      if (comissoes.length === 0) {
        return { success: false, message: "Estabelecimento não tem comissões" };
      }

      for await (const comissao of comissoes) {
        await tx.caixa.updateMany({
          where: {
            establishmentId: comissao.establishmentId,
            referenceDate: {
              gte: comissao.referenceDate,
            },
          },
          data: {
            total: {
              increment: comissao.value,
            },
          },
        });
      }

      return {
        success: true,
        message: "Estabelecimento atualizado com sucesso",
      };
    });

    if (!success) {
      return NextResponse.json({ message, status: 400 });
    }
    return NextResponse.json({ message, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("establishment update", error);
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof URIError ||
      error instanceof ReferenceError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json({ message: error.message, status: 500 });
    }
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
