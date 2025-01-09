import {
  EstabelecimentoRepository,
  ImportarRepository,
} from "@/app/api/repositories";
import { EstabelecimentoService, ImportacaoService } from "@/app/api/services";
import { CompaniesController } from "@/app/api/controller";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";

import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export const importarUseCase = async (req: Request) => {
  const data = await req.formData();
  const importacao = new ImportacaoService(new ImportarRepository());
  const companies = new CompaniesController();
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );
  const { error, data: dados } = importacao.lerInformacoesDoFormulario(data);
  if (error) {
    return new NextResponse(null, {
      status: 422,
      statusText: "Algum dado nao foi preenchido",
    });
  }
  return await prisma.$transaction(async () => {
    try {
      const todosEstabelecimentosDoSite =
        await estabelecimentoService.encontrarMuitosEstabelecimentosPorSite(
          dados.site,
        );
      const { importação: seImportacaoJaExiste } =
        await importacao.buscarPorImportacaoPorDataESite(
          dados.weekReference as Date,
          dados.site,
        );
      if (seImportacaoJaExiste)
        return new NextResponse(
          JSON.stringify({ message: "Importação já existe" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      await companies.create();
      const { file, message, success } = await importacao.formatarPlanilha(
        dados.file,
        dados.site as keyof FormatterFunctions,
      );
      if (!success) {
        return new NextResponse(JSON.stringify({ message }), {
          status: 500,
        });
      }
    } catch (error) {
      console.error("importarUseCase", error);
    }
  });
};
