import { HttpStatusCode } from "@/domain/enum";
import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const supervisores = await prisma.supervisor.findMany({
      select: {
        id: true,
        name: true,
        Localidade: { select: { name: true } },
        Secao: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ supervisores }, { status: HttpStatusCode.OK });
  } catch (error: any) {
    console.error("Erro ao obter supervisores", error);
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
