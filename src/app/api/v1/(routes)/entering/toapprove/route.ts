import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";
import { getToken } from "next-auth/jwt";

async function routerDepositOrWithdrawal(
  id: number,
  referenceDate: Date,
  value: number,
  route: string,
  approve: boolean,
  cicloId?: number,
) {
  let router;
  if (route === "deposito") {
    router = "deposit";
  }
  if (route === "sangria") {
    router = "withdrawal";
  }
  if (route === "despesa") {
    router = "expenses";
  }
  if (route === "negativo") {
    router = "negativo";
  }
  if (route === "prestação") {
    return await fetch(
      `${process.env.APP_URL}/api/v1/entering/prestacao/aprovar`,
      {
        body: JSON.stringify({ id, referenceDate, value, approve, cicloId }),
        method: "POST",
      },
    );
  }
  return await fetch(
    `${process.env.APP_URL}/api/v1/entering/deposit-withdrawal/${router}`,
    {
      body: JSON.stringify({ id, referenceDate, value, approve }),
      method: "POST",
    },
  );
}

export async function PUT(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();
  const token = await getToken({ req });

  const lancamento = {
    enteringId: parseInt(data.id),
    status: data.status as "aprovado" | "reprovado",
    establishmentId: parseInt(data.establishmentId),
    referenceDate: data.referenceDate,
    type: data.type,
    value: data.value * 100,
    status_action: data.status_action,
  };

  const useLancamento = new Entering(lancamento);

  const lancamentoId = await useLancamento.read();
  if (!lancamentoId) return NextResponse.json({ error: "Id não informado" });
  const { id, referenceDate } = lancamentoId;
  const put = {
    approved_by: token!.username as any,
  };
  if (token && !token.username) {
    return NextResponse.json({ status: 401, error: "Usuário não autenticado" });
  }
  try {
    const fetchResult = await routerDepositOrWithdrawal(
      lancamento.establishmentId,
      referenceDate,
      lancamento.value,
      lancamento.type,
      lancamento.status_action,
      data.id_ciclo,
    );
    const result = await fetchResult.json();
    if (result.status === 200) {
      await useLancamento.toFloat(Number(id), put, lancamento.status);
      return NextResponse.json({ status: 200, message: result.message });
    }
    return NextResponse.json({ status: 500, message: result.message });
  } catch (error) {
    console.error("entering toapprove put", error);
    return NextResponse.json({ status: 500, message: "Erro ao atualizar" });
  }
}
