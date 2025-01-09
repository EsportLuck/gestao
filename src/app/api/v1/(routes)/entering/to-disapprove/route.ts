import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Entering } from "@/app/api/models/entering.model";
import { getToken } from "next-auth/jwt";
import { debitOrCredit } from "@/app/api/v1/utils/debitOrCredit";
import { Establishment } from "@/app/api/controller/establishment.controller";

async function routerDepositOrWithdrawal(
  id: number,
  referenceDate: Date,
  value: number,
  route: string,
  approve: boolean,
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
  const establishment = {
    id: lancamento.establishmentId,
    referenceDate: referenceDate.toString(),
  };
  const useEstablishment = new Establishment(establishment);

  const caixas = await useEstablishment.findUniqueWeeklyCharge();

  const put = {
    approved_by: token!.username as any,
  };

  try {
    if (lancamento.status_action === "analise") {
      await useLancamento.toFloat(Number(id), put, lancamento.status);
    } else {
      await Promise.all([
        routerDepositOrWithdrawal(
          lancamento.establishmentId,
          referenceDate,
          lancamento.value,
          lancamento.type,
          lancamento.status_action,
        ),
        useLancamento.toFloat(Number(id), put, lancamento.status),
      ]);

      for await (const item of caixas) {
        await prisma.caixa.update({
          where: {
            id: item.id,
          },
          data: {
            total: debitOrCredit(
              item.value,
              lancamento.value,
              lancamento.type,
              lancamento.status_action,
            ),
          },
        });
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("entering to-disapprove put", error);
    return NextResponse.json({ status: 500, error: "Erro ao atualizar" });
  }
}
