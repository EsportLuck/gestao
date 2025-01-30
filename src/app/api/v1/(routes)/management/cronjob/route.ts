import { InternalServerError } from "@/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const data = await prisma.cronjob.findMany({
      orderBy: { id: "asc" },
      take: 6,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
