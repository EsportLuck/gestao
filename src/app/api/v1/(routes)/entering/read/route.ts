import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";
import { MissingDataError } from "@/domain/errors";
import { HttpStatusCode } from "@/domain/enum";

export const revalidate = 0;

export async function POST(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  if (data.data_final === undefined && data.data_inicial === undefined) {
    throw new MissingDataError("data_final ou data_inicial");
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
    return NextResponse.json(read, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error("entering read post", error);
    return NextResponse.json({ error });
  }
}
