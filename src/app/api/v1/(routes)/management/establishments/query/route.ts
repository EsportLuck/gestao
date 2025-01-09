import { InternalServerError } from "@/errors";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<void | Response> {
  try {
    const data = await prisma.estabelecimento.findMany({
      select: {
        name: true,
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
