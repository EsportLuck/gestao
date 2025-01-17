import { deleteImportacaoUseCase } from "@/app/api/use-cases/importacao";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request });
  const { weekReference, site, idImportacao } = await request.json();

  try {
    await deleteImportacaoUseCase(weekReference, site, idImportacao, token);
    const data = {
      status: 200,
      message: "Apagado com sucesso",
    };
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof TypeError ||
      error instanceof SyntaxError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      console.error("import delete", error);
      return new Response(
        JSON.stringify({ status: 500, message: error.message }),
        { status: 500 },
      );
    } else {
      console.error("import delete: Desconhecido", error);
      const data = {
        status: 500,
        message: "Error desconhecido",
      };
      return new Response(JSON.stringify(data), { status: 500 });
    }
  }
}
