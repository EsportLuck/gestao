import { prisma } from "@/services/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<Response> {
  const data = await req.json();

  console.log(data);

  try {
    const { success, message } = await prisma.$transaction(async (tx) => {
      return { success: true, message: "Negativo aprovado com sucesso" };
    });

    return NextResponse.json({ status: 200, success, message });
  } catch (error) {
    console.error("Error processing request:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json({ status: 500, message: error.message });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}
