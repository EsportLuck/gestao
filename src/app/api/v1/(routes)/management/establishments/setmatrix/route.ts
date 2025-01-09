import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(body: NextRequest) {
  const { establishment } = await body.json();
  try {
    const establishmentMatrix = await prisma.estabelecimento.findUnique({
      where: {
        name: establishment,
      },
    });
    if (!establishmentMatrix)
      return NextResponse.json(
        { error: `'Establishment not found' ${establishment}` },
        { status: 404 },
      );
    await prisma.estabelecimento.update({
      where: {
        name: establishment,
      },
      data: {
        filiais: establishment,
        updatedAt: new Date(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `'Internal Server Error' ${error.message}` },
      { status: 500 },
    );
  }
  return NextResponse.json("Ok", { status: 204 });
}
