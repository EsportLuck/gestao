import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";

export async function DELETE(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  const useLancamento = new Entering(data);
  const lancamentoId = await useLancamento.read();
  if (!lancamentoId) return NextResponse.json({ error: "Id não informado" });
  const { id } = lancamentoId;
  try {
    const read = await useLancamento.delete(id);
    return NextResponse.json(read, { status: 200 });
  } catch (error) {
    console.error("delete entering", error);
    return NextResponse.json({ error });
  }
}
