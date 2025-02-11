import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";

export const revalidate = 0;

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  if (
    data.data_final === undefined &&
    data.data_inicial === undefined &&
    data.estabelecimento === undefined &&
    data.forma_pagamento === undefined &&
    data.tipo === undefined
  ) {
    return NextResponse.json({ error: "Data não informada" }, { status: 400 });
  }
  const lancamento = new Entering(data);

  try {
    let read;
    if (data.data_inicial) {
      read = await lancamento.readWeek();
    }
    if (data.data_final) {
      read = await lancamento.readWithReleaseDateOf();
    }
    return NextResponse.json(read, { status: 200 });
  } catch (error) {
    console.error("entering read post", error);
    return NextResponse.json({ error });
  }
}
