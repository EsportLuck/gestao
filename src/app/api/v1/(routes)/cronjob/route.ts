import {
  CaixaRepository,
  CronJobCriarCaixaDiarioRepository,
  EstabelecimentoRepository,
} from "@/app/api/repositories";
import {
  CaixaService,
  CronJobCriarCaixaDiarioService,
  EstabelecimentoService,
} from "@/app/api/services";
import { prisma } from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { success: false, message: "Requerimento não autorizado" },
      { status: 401 },
    );
  }
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );
  const caixaService = new CaixaService(new CaixaRepository());
  const cronJobService = new CronJobCriarCaixaDiarioService(
    new CronJobCriarCaixaDiarioRepository(),
    estabelecimentoService,
    caixaService,
  );
  try {
    const { success, message } = await prisma.$transaction(
      async () => {
        const params = searchParams.get("date");
        const date = new Date(params || new Date());
        const { success, message } =
          await cronJobService.executarCronjobCaixa(date);
        if (!success) {
          return { success, message };
        }
        return { success, message };
      },
      { timeout: 20000 },
    );
    if (!success) {
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    return NextResponse.json({ success, message }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
