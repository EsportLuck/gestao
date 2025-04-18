import { HttpStatusCode } from "@/domain/enum";
import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const secoes = await prisma.secao.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ secoes }, { status: HttpStatusCode.OK });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
