import { deleteImportacaoUseCase } from "@/app/api/use-cases/importacao";
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
    console.error("import delete", error);
    return new Response(null, { status: 500 });
  }
}
