import { Establishment } from "@/app/api/controller/establishment.controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const establishment = new Establishment(data);
  try {
    await establishment.updateToFilial();
    return NextResponse.json(
      { message: "Establishment updated to filial successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("establishments update to filial", error);
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
