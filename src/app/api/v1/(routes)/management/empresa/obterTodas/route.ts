import { EmpresaRepository } from "@/app/api/repositories/EmpresaRepository";
import { EmpresaService } from "@/app/api/services/EmpresaService";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<
  | NextResponse<{
      empresas: {
        id: number;
        name: string;
      }[];
    }>
  | NextResponse<{
      status: number;
    }>
> {
  try {
    const empresaService = new EmpresaService(new EmpresaRepository());
    const empresas: { id: number; name: string }[] =
      await empresaService.obterTodas();

    return NextResponse.json({ empresas });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
