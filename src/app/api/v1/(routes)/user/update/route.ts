import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password, role, site } = body;

  if (!username && !email && !password && !role && !site)
    return NextResponse.json(
      { message: `Precisa de pelo menos um dado para ser alterado` },
      { status: 400 },
    );

  if (username) {
    try {
      await prisma.user.update({
        where: { email },
        data: {
          username,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  if (email) {
    try {
      await prisma.user.update({
        where: { email },
        data: {
          email,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  if (role) {
    try {
      await prisma.user.update({
        where: { email },
        data: {
          role,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  if (site) {
    try {
      await prisma.user.update({
        where: { email },
        data: {
          site,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }

  return NextResponse.json({ message: `Usuário Atualizado` }, { status: 204 });
}
