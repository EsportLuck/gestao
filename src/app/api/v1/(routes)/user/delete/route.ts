import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email)
    return NextResponse.json(
      { message: `Algum dado faltando` },
      { status: 400 },
    );
  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!exist)
    return NextResponse.json(
      { message: `Email não cadastrado` },
      { status: 400 },
    );
  try {
    await prisma.user.delete({
      where: {
        email,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: `Usuário Deletado` }, { status: 204 });
}
