import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  try {
    await prisma.observacao.create({
      data: {
        comentario: data.comentario,
        createdBy: data.createdBy,
        lancamentoId: data.id,
      },
    });
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("create entering", error);
    return NextResponse.json({ status: 401 });
  }
}
