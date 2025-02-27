import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const id = Number(req.nextUrl.searchParams.get("id"));
  try {
    const data = await prisma.supervisor.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        Localidade: {
          select: {
            name: true,
            id: true,
          },
        },
        Secao: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    const response = {
      id: data?.id,
      name: data?.name,
      localidade: data?.Localidade
        ? data.Localidade
        : "Conecte a uma localidade",
      secao: data?.Secao ? data.Secao : "Conecte a uma seção",
      criado: data?.createdAt.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
      atualizado: data?.updatedAt.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
