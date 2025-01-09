import { prisma } from "@/services/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  const initialDate = new Date(data.referenceDate);
  try {
    const { message, status } = await prisma.$transaction(async (tx) => {
      const negativo = await tx.negativo.findFirst({
        where: {
          establishmentId: data.id,
          referenceDate: initialDate,
        },
      });
      if (!negativo) {
        await tx.negativo.create({
          data: {
            referenceDate: new Date(data.referenceDate),
            establishmentId: data.id,
            value: data.value,
          },
        });
      } else {
        await tx.negativo.update({
          where: {
            id: negativo.id,
          },
          data: {
            value: {
              increment: data.value,
            },
          },
        });
      }

      const updateCaixas = await tx.caixa.updateMany({
        where: {
          establishmentId: data.id,
          referenceDate: {
            gte: initialDate,
          },
        },
        data: {
          total: {
            increment: data.value,
          },
        },
      });
      if (updateCaixas.count === 0) {
        throw new Error(
          `Nenhum caixa encontrado para o estabelecimento ${data.id} na data ${initialDate.toISOString()}.`,
        );
      }
      return { status: 200, message: "Negativo aprovado com sucesso" };
    });

    return NextResponse.json({ status, message });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({
        status: 500,
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
    } else if (error instanceof Error) {
      return NextResponse.json({
        status: 500,
        message: error.message,
        stack: error.stack,
      });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Ocorreu um erro ao processar a transação.",
      });
    }
  }
}
