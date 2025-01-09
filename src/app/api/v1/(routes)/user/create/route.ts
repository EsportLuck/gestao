import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password, role, site } = body;

  if (!username || !email || !password || !role || !site)
    return NextResponse.json(
      { message: `Algum dado faltando` },
      { status: 400 },
    );
  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exist)
    return NextResponse.json(
      { message: `Email já cadastrado` },
      { status: 409 },
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        site,
      },
    });
    if (role === "supervisor") {
      await prisma.supervisor.create({
        data: {
          name: username,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: `Usuário Criado` }, { status: 201 });
}
