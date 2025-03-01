import { EmpresaRepository } from "@/app/api/repositories/EmpresaRepository";
import { EmpresaService } from "@/app/api/services/EmpresaService";
import { HttpStatusCode } from "@/domain/enum";
import {
  DuplicateRecordError,
  isAppError,
  InternalServerError,
} from "@/domain/errors";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const empresaService = new EmpresaService(new EmpresaRepository());
    const { nome } = await request.json();
    await empresaService.criar(nome);

    return NextResponse.json({ status: HttpStatusCode.OK });
  } catch (error) {
    if (error instanceof DuplicateRecordError) {
      return NextResponse.json({
        message: error.message,
        status: error.statusCode,
      });
    }

    if (isAppError(error)) {
      return NextResponse.json({
        message: error.message,
        status: error.statusCode,
      });
    }

    const internalError = new InternalServerError({
      message: "Erro ao criar empresa",
    });

    return NextResponse.json({
      message: internalError.message,
      status: internalError.statusCode,
    });
  }
}
