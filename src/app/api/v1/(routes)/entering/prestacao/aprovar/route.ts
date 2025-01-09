import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  const { id, referenceDate, value, approve, cicloId } = data;
  if (
    typeof id !== "number" ||
    !referenceDate ||
    typeof value !== "number" ||
    !approve ||
    typeof cicloId !== "number"
  ) {
    return NextResponse.json({ status: 400, message: "Dados inválidos" });
  }
  return await prisma.$transaction(async (tx) => {
    try {
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
        return NextResponse.json(
          { message: "Nenhum caixa encontrado" },
          { status: 404 },
        );
      }
      const updateCaixas = await tx.caixa.updateMany({
        where: {
          id: {
            in: caixas.map((caixa) => caixa.id),
          },
        },
        data: {
          total: {
            decrement: value,
          },
        },
      });
      if (updateCaixas.count === 0) {
        return NextResponse.json(
          { message: "Nenhum caixa encontrado" },
          { status: 404 },
        );
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
      return NextResponse.json(
        { message: "Prestacao criada com sucesso" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
