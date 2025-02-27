import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const data = await prisma.estabelecimento.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
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
