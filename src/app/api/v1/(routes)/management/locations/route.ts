import { LocalidadeRepository } from "@/app/api/repositories/LocalidadeRepository";
import { LocalidadeService } from "@/app/api/services/LocalidadeService";
import { InternalServerError } from "@/domain/errors";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const localidadeService = new LocalidadeService(new LocalidadeRepository());
    const { localidade: data, error } =
      await localidadeService.encontrarTodasAsLocalidade();

    if (error) throw new Error("Não foi possível encontrar as localidades");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
