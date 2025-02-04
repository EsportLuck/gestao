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
      const deposito = await tx.deposito.findFirst({
        where: {
          establishmentId: data.id,
          referenceDate: initialDate,
        },
      });

      if (typeof deposito?.id === "undefined") {
        await tx.deposito.create({
          data: {
            referenceDate: initialDate,
            establishmentId: data.id,
            value: data.value,
          },
        });

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
      } else {
        await tx.deposito.update({
          where: {
            id: deposito.id,
          },
          data: {
            value: {
              increment: data.value,
            },
          },
        });
        const updateCaixas = await tx.caixa.updateMany({
          where: {
            establishmentId: data.id,
            referenceDate: {
              gte: initialDate,
            },
          },
          data: {
            total: {
              decrement: data.value,
            },
          },
        });
        if (updateCaixas.count === 0) {
          throw new Error(
            `Nenhum caixa encontrado para o estabelecimento ${data.id} na data ${initialDate.toISOString()}.`,
          );
        }
      }

      if (typeof deposito?.id !== "undefined" && data.approve === "aprovado") {
        await tx.deposito.update({
          where: {
            id: deposito?.id,
          },
          data: {
            value: {
              decrement: data.value,
            },
          },
        });
        const updateCaixas = await tx.caixa.updateMany({
          where: {
            establishmentId: data.id,
            referenceDate: {
              gte: initialDate,
            },
          },
          data: {
            total: {
              decrement: data.value,
            },
          },
        });
        if (updateCaixas.count === 0) {
          throw new Error(
            `Nenhum caixa encontrado para o estabelecimento ${data.id} na data ${initialDate.toISOString()}.`,
          );
        }
      }

      return { status: 200, message: "Depósito aprovado com sucesso" };
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
