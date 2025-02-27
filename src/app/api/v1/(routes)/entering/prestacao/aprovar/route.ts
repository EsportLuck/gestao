import { prisma } from "@/services/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<Response> {
  const data = await req.json();
  const { id, referenceDate, value, approve, cicloId } = data;

  if (
    typeof id !== "number" ||
    !referenceDate ||
    typeof value !== "number" ||
    typeof approve !== "string" ||
    typeof cicloId !== "number"
  ) {
    return NextResponse.json({ status: 400, message: "Dados inválidos" });
  }

  try {
    const { success, message } = await prisma.$transaction(async (tx) => {
      const caixas = await tx.caixa.findMany({
        where: {
          establishmentId: id,
          referenceDate: {
            gte: new Date(referenceDate),
          },
        },
        orderBy: {
          referenceDate: "asc",
        },
      });

      if (!caixas.length) {
        return { success: false, message: "Nenhum caixa encontrado" };
      }

      const updateCaixas = await tx.caixa.updateMany({
        where: {
          establishmentId: id,
          referenceDate: {
            gte: new Date(referenceDate),
          },
        },
        data: {
          total: {
            decrement: value,
          },
        },
      });

      if (updateCaixas.count === 0) {
        return { success: false, message: "Nenhum caixa encontrado" };
      }

      const novoTotal = caixas[0].total - value;

      if (novoTotal < 10) {
        await tx.ciclo.update({
          where: { id: cicloId },
          data: { status: "PAGO" },
        });
      }

      await tx.prestacao.create({
        data: {
          value: value,
          referenceDate: new Date(referenceDate),
          establishmentId: id,
        },
      });

      return { success: true, message: "Prestacao criada com sucesso" };
    });

    return NextResponse.json({ status: 200, success, message });
  } catch (error) {
    console.error("Error processing request:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json({ status: 500, message: error.message });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}
