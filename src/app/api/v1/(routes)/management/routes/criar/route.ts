import { RotaRepository } from "@/app/api/repositories/RotaRepository";
import { RotaService } from "@/app/api/services/RotaService";
import { prisma } from "@/services/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0;

export async function POST(request: NextRequest): Promise<void | Response> {
  const { name, empresa } = await request.json();
  try {
    const rotaService = new RotaService(new RotaRepository());
    await rotaService.criar(name, empresa);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
