import { Establishment } from "@/app/api/controller/establishment.controller";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const establishment = new Establishment(data);

  try {
    await establishment.update();
    return NextResponse.json(
      { message: "Establishment updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("establishment update", error);
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
