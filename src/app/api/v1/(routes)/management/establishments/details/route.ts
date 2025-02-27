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
    const data = await prisma.estabelecimento.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        localidade: {
          select: {
            name: true,
          },
        },
        secao: {
          select: {
            name: true,
          },
        },
        supervisor: {
          select: {
            name: true,
          },
        },
        status_atividade: true,
        comissao_retida: true,
        empresa: true,
        filiais: true,
        site: true,
        matrizId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const response = {
      name: data?.name,
      localidade: data?.localidade
        ? data.localidade.name
        : "Conecte a uma localidade",
      secao: data?.secao ? data.secao.name : "Conecte a uma seção",
      status_atividade: data?.status_atividade,
      comissao_retida: data?.comissao_retida,
      empresa: data?.empresa,
      filiais: data?.filiais,
      supervisor: data?.supervisor?.name,
      site: data?.site,
      matriz: data?.matrizId,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
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
