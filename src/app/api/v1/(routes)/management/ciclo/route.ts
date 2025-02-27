import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest): Promise<void | Response> {
  const estabelecimento = req.nextUrl.searchParams.get("estabelecimento");
  try {
    const data = await prisma.ciclo.findMany({
      where: {
        establishmentId: Number(estabelecimento),
        status: "PENDENTE",
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
