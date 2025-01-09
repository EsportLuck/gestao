import { EmpresaRepository } from "@/app/api/repositories/EmpresaRepository";
import { EmpresaService } from "@/app/api/services/EmpresaService";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const empresaService = new EmpresaService(new EmpresaRepository());
    const { nome } = await request.json();
    await empresaService.criar(nome);

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, status: 409 });
  }
}
