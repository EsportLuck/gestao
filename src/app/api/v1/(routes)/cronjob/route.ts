import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { obterDiaAnterior } from "@/app/api/v1/utils/obterDiaAnterior";
import { Prisma } from "@prisma/client";
import { obterInicioEFimDoCiclo } from "../../utils/obterInicioEFimDoCiclo";
export const revalidate = 0;
export const maxDuration = 60;

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
        const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(
          new Date(data),
        );
        const ciclo = await tx.ciclo.findFirst({
          where: {
            reference_date: { gte: inicioDoCiclo, lt: finalDoCiclo },
            empresa: { name: empresa },
          },
        });
        if (typeof ciclo?.id === "number") {
          return { success: false, message: "Ciclo já criado" };
        }
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
        const cronjob = await tx.cronjob.findFirst({
          where: {
            name: empresa,
            date: data,
          },
        });
        if (typeof cronjob?.id === "number") {
          return {
            success: false,
            message: `Caixa da empresa ${empresa} na data ${data} já criada`,
          };
        }
        await tx.cronjob.create({
          data: {
            name: empresa,
            date: data,
          },
        });

        for await (const item of todosEstabelecimentos) {
          const caixa = item.caixa?.[0];

          if (typeof caixa?.id !== "number") {
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
      { timeout: 200000 },
    );

    if (!success) {
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    return NextResponse.json({ success, message }, { status: 200 });
  } catch (error) {
    console.error(error);
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
