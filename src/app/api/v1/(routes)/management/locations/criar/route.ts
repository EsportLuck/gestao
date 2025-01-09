import { LocalidadeRepository } from "@/app/api/repositories/LocalidadeRepository";
import { LocalidadeService } from "@/app/api/services/LocalidadeService";
import { prisma } from "@/services/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0;

export async function POST(request: NextRequest): Promise<void | Response> {
  const { name, empresa } = await request.json();
  try {
    const localidadeService = new LocalidadeService(new LocalidadeRepository());
    await localidadeService.criar(name, empresa);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
