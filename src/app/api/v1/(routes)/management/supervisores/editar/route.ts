import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function PATCH(req: NextRequest): Promise<void | Response> {
  try {
    const { nomeDoSupervisor, novoNomeDoSupevisor } = await req.json();

    if (!nomeDoSupervisor || !novoNomeDoSupevisor) {
      return NextResponse.json(
        { error: "Algum dado não foi preenchido" },
        { status: 400 },
      );
    }

    await prisma.supervisor.update({
      where: { name: nomeDoSupervisor },
      data: { name: novoNomeDoSupevisor },
    });
    await prisma.user.update({
      where: { username: nomeDoSupervisor },
      data: { username: novoNomeDoSupevisor },
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar nome do supervisor", error);
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
