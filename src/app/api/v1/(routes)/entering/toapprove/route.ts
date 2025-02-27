import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";

async function routerDepositOrWithdrawal(
  id: number,
  referenceDate: Date,
  value: number,
  route: string,
  approve: boolean,
  cicloId?: number,
) {
  const validRoutes = [
    "deposito",
    "sangria",
    "despesa",
    "negativo",
    "prestação",
  ];

  if (!validRoutes.includes(route)) {
    throw new Error(`Route inválida: ${route}`);
  }

  let router;
  switch (route) {
    case "deposito":
      router = "deposit";
      break;
    case "sangria":
      router = "withdrawal";
      break;
    case "despesa":
      router = "expenses";
      break;
    case "negativo":
      return await fetch(
        `${process.env.APP_URL}/api/v1/entering/negativo/aprovar`,
        {
          body: JSON.stringify({ id, referenceDate, value, approve, cicloId }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    case "prestação":
      return await fetch(
        `${process.env.APP_URL}/api/v1/entering/prestacao/aprovar`,
        {
          body: JSON.stringify({ id, referenceDate, value, approve, cicloId }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  }

  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return await fetch(
    `${baseUrl}/api/v1/entering/deposit-withdrawal/${router}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, referenceDate, value, approve, cicloId }),
    },
  );
}

export async function PUT(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  try {
    const data = await req.json();

    if (
      typeof data.id !== "string" ||
      typeof data.referenceDate !== "string" ||
      typeof data.value !== "number" ||
      !["aprovado", "reprovado", "analise"].includes(data.status_action)
    ) {
      return NextResponse.json({ status: 400, error: "Dados inválidos" });
    }

    const token = await getToken({ req });
    if (!token?.username) {
      return NextResponse.json({
        status: 401,
        error: "Usuário não autenticado",
      });
    }

    const lancamento = {
      enteringId: parseInt(data.id),
      status: data.status as "aprovado" | "reprovado",
      establishmentId: parseInt(data.establishmentId),
      referenceDate: data.referenceDate,
      type: data.type,
      value: Math.round(data.value * 100),
      status_action: data.status_action,
    };

    const useLancamento = new Entering(lancamento);

    const lancamentoId = await useLancamento.read();

    if (!lancamentoId) {
      return NextResponse.json({
        error: "Lançamento não encontrado no banco de dados",
      });
    }

    const { id, referenceDate } = lancamentoId;
    const put = {
      approved_by: token.username as any,
    };

    const fetchResult = await routerDepositOrWithdrawal(
      lancamento.establishmentId,
      new Date(referenceDate),
      lancamento.value,
      lancamento.type,
      lancamento.status_action,
      data.id_ciclo,
    );

    if (!fetchResult.ok) {
      return NextResponse.json({
        status: fetchResult.status,
        message: "Erro ao chamar API externa",
      });
    }

    const result = await fetchResult.json();

    if (result.status === 200) {
      await useLancamento.toFloat(Number(id), put, lancamento.status);
      return NextResponse.json({ status: 200, message: result.message });
    }

    return NextResponse.json({ status: 500, message: result.message });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return NextResponse.json({
        status: 500,
        message: "Erro no Prisma: " + error.message,
      });
    } else if (error instanceof Error) {
      return NextResponse.json({
        status: 500,
        message: "Erro: " + error.message,
      });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Erro desconhecido no PUT",
      });
    }
  }
}
