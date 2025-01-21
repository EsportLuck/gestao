import { Establishment } from "@/app/api/controller/establishment.controller";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  console.log(data);
  try {
    return NextResponse.json(
      { message: "Comissão retida com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("establishment update", error);
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
