import { InternalServerError } from "@/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<void | Response> {
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  try {
    const data = await prisma.estabelecimento.findMany({
      select: {
        name: true,
        vendas: {
          select: {
            value: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },
        comissao: {
          select: {
            value: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },
        deposito: {
          select: {
            value: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },
        sangria: {
          select: {
            value: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },

        liquido: {
          select: {
            value: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },
        caixa: {
          select: {
            total: true,
            referenceDate: true,
          },
          where: {
            referenceDate: {
              gte: new Date(start as string),
              lte: new Date(end as string),
            },
          },
        },
        status_compromisso: true,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
