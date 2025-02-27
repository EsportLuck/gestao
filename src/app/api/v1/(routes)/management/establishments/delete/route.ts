import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  try {
    await prisma.estabelecimento.deleteMany();

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error("establishments delete", error);
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
