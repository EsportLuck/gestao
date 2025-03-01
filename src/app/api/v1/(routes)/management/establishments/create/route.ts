import { HttpStatusCode } from "@/domain/enum";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const { success, message } = await prisma.$transaction(async () => {
      try {
        await prisma.estabelecimento.create({
          data: {
            name: data.name.trim(),
            site: data.localidade.toLowerCase(),
            empresa: {
              connect: {
                name: data.empresa,
              },
            },
            localidade: {
              connect: {
                name: data.localidade,
              },
            },
            secao: {
              connect: {
                name: data.secao,
              },
            },
            companies: {
              connect: {
                id: 1,
              },
            },
          },
        });
        return {
          success: true,
          message: "Estabelecimento criado com sucesso!",
        };
      } catch (err) {
        return {
          success: false,
          message: "Algo deu errado ao criar o estabelecimento",
        };
      }
    });
    if (!success)
      return NextResponse.json(
        { success, message },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    return NextResponse.json(
      { success, message },
      { status: HttpStatusCode.CREATED },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `${error}` },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
