import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { obterDiaAnterior } from "@/app/api/v1/utils/obterDiaAnterior";
import { Prisma } from "@prisma/client";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { success: false, message: "Requerimento não autorizado" },
      { status: 401 },
    );
  }

  try {
    const data = searchParams.get("date");
    const empresa = searchParams.get("empresa");
    const user = searchParams.get("user");
    if (!data || !empresa || !user) {
      return NextResponse.json({ success: false, message: "Dados inválidos" });
    }
    const { success, message } = await prisma.$transaction(
      async (tx) => {
        const { startOfDay } = obterDiaAnterior(data);
        const todosEstabelecimentos = await tx.estabelecimento.findMany({
          where: {
            empresa: {
              name: empresa,
            },
          },
          select: {
            id: true,
            name: true,
            caixa: {
              where: {
                referenceDate: startOfDay,
              },
            },
          },
        });
        for await (const item of todosEstabelecimentos) {
          const caixa = item.caixa?.[0];

          if (typeof caixa.id !== "number") {
            await tx.caixa.create({
              data: {
                referenceDate: startOfDay,
                status: "PENDENTE",
                total: 0,
                importacaoId: null,
                establishmentId: item.id,
                createdBy: `CRONJOB ${data}  ${user}`,
              },
            });
          } else {
            await tx.caixa.create({
              data: {
                referenceDate: new Date(data),
                status: "PENDENTE",
                total: caixa.total,
                importacaoId: null,
                establishmentId: item.id,
                createdBy: `CRONJOB ${data}  ${user}`,
              },
            });
          }
        }
        return { success: true, message: "Caixas criadas com sucesso" };
      },
      { timeout: 20000 },
    );

    if (!success) {
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    return NextResponse.json({ success, message }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Erro desconhecido",
      });
    }
  }
}
