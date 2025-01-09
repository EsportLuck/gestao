import { prisma } from "@/services/prisma";

import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const data = await prisma.importacao.findMany({
      select: {
        id: true,
        name: true,
        state: true,
        relatorio: true,
        createdAt: true,
        referenceDate: true,
        modifiedBy: true,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(" imported reports get", error);
    return NextResponse.json(
      { status: 500 },
      { status: 500, statusText: "Algo deu errado" },
    );
  }
}
