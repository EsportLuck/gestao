import { NextResponse } from "next/server";

import { CompaniesController } from "@/app/api/controller";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import {
  EstabelecimentoService,
  ImportacaoService,
  LocalidadeService,
  SecaoService,
} from "@/app/api/services";
import {
  EstabelecimentoRepository,
  ImportarRepository,
  LocalidadeRepository,
  SecaoRepository,
} from "@/app/api/repositories";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { prisma } from "@/services/prisma";
import { Prisma } from "@prisma/client";

export const maxDuration = 60;

export async function POST(req: Request) {
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );
  const localidadeService = new LocalidadeService(new LocalidadeRepository());
  const secaoService = new SecaoService(new SecaoRepository());
  const importacaoService = new ImportacaoService(new ImportarRepository());
  const data = await req.formData();

  const { error, data: dados } =
    importacaoService.lerInformacoesDoFormulario(data);

  if (error) {
    return NextResponse.json({ status: 422, message: "Dados Invalidos" });
  }

  const { importação: seImportacaoJaExiste } =
    await importacaoService.buscarPorImportacaoPorDataESite(
      new Date(dados.weekReference as Date),
      dados.site,
    );
  if (seImportacaoJaExiste)
    return NextResponse.json({ status: 409, message: "Importação já existe" });

  const cronJob = await prisma.cronjob.findMany({
    where: {
      date: new Date(dados.weekReference as Date),
      name: dados.company,
    },
  });

  if (cronJob.length === 0) {
    return NextResponse.json({
      status: 403,
      message: "Importação não pode ser realizada fora da sequência",
    });
  }

  const [todosEstabelecimentosDoSite, todasAsLocalidades, todasAsSeções] =
    await Promise.all([
      estabelecimentoService.encontrarTodosOsEstabelecimentos(),
      localidadeService.encontrarTodasAsLocalidadesPorEmpresa(dados.company),
      secaoService.encontrarTodasAsSecoesPorEmpresa(dados.company),
    ]);

  try {
    const companies = new CompaniesController();

    await companies.create();

    const { file, message, success } = await importacaoService.formatarPlanilha(
      dados.file,
      dados.site as keyof FormatterFunctions,
    );

    if (!success) return NextResponse.json({ status: 500, message });
    const { status, messagePrisma } = await prisma.$transaction(
      async (tx) => {
        const importação = await tx.importacao.create({
          data: {
            name: dados.user,
            referenceDate: dados.weekReference as Date,
            relatorio: dados.site,
            state: "Importado",
          },
        });
        const { success: successGravarDados, message: messageGravarDados } =
          await importacaoService.gravarDadosNoBanco(
            file,
            dados.site as keyof FormatterFunctions,
            dados.weekReference as Date,
            dados.company,
            dados.user,
            todosEstabelecimentosDoSite.estabelecimento as EstabelecimentoSelecionado[],
            todasAsLocalidades,
            todasAsSeções,
            importação?.id as number,
            tx,
          );
        if (!successGravarDados) {
          throw new Error(
            `Erro ao gravar os dados no banco: ${messageGravarDados}`,
          );
        }
        return { status: 200, messagePrisma: "Importado com sucesso" };
      },
      { maxWait: 20000 },
    );

    const data = {
      status,
      message: messagePrisma,
    };
    return NextResponse.json(data);
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      return NextResponse.json({
        status: 500,
        message: ` Tipo do error ${error.message} `,
      });
    } else {
      console.error("import post", error);
      return NextResponse.json({
        status: 500,
        message: "Erro interno do servidor",
      });
    }
  }
}
