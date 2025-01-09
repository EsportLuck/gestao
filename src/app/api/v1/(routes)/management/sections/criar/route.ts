import { SecaoRepository } from "@/app/api/repositories/SecaoRepository";
import { SecaoService } from "@/app/api/services/SecaoService";
import { prisma } from "@/services/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0;

export async function POST(request: NextRequest): Promise<void | Response> {
  const { name, empresa } = await request.json();
  try {
    const secaoService = new SecaoService(new SecaoRepository());
    await secaoService.criar(name, empresa);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
