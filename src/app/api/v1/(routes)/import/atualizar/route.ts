import {
  CaixaRepository,
  ImportarRepository,
  LiquidoRepository,
  PremiosRepository,
} from "@/app/api/repositories";
import {
  CaixaService,
  ImportacaoService,
  LiquidoService,
  PremiosService,
} from "@/app/api/services";
import { prisma } from "@/services/prisma";
import { NextRequest } from "next/server";
import {
  FormatterFunctions,
  ReportCategory,
  reportSites,
} from "@/app/api/v1/utils/strategy";
import {
  TReportAtena,
  TFormattedReportArenaSite,
  IFormattedReportSportNet,
} from "@/app/api/v1/types";

export async function PATCH(request: NextRequest) {
  const response = await request.formData();
  const formDataWeekReference = response.get("weekReference");
  const formDataSite = response.get("site") as string;
  const formDataIdImportacao = response.get("idImportacao");
  const formDataUser = response.get("user");
  const formDataFile = response.get("file");

  const importacaoService = new ImportacaoService(new ImportarRepository());
  const liquidoService = new LiquidoService(new LiquidoRepository());
  const premiosService = new PremiosService(new PremiosRepository());
  if (
    !formDataWeekReference ||
    !formDataSite ||
    !formDataIdImportacao ||
    !formDataUser ||
    formDataFile === "null"
  ) {
    return new Response(null, { status: 400 });
  }
  try {
    const { success, message, file } = await importacaoService.formatarPlanilha(
      formDataFile as File,
      formDataSite as keyof FormatterFunctions,
    );
    if (!success) {
      return new Response(message, { status: 500 });
    }
    const { success: successAtualizacao, message: messageAtualizacao } =
      await prisma.$transaction(
        async (tx) => {
          try {
            const importacao = await tx.importacao.findUnique({
              where: {
                id: Number(formDataIdImportacao),
              },
              select: {
                id: true,
                Premios: {
                  select: {
                    id: true,
                    establishment: {
                      select: {
                        name: true,
                      },
                    },
                    value: true,
                  },
                },
                Liquido: {
                  select: {
                    id: true,
                    establishment: {
                      select: {
                        name: true,
                      },
                    },
                    value: true,
                  },
                },
              },
            });

            const caixas = await tx.caixa.findMany({
              where: {
                referenceDate: {
                  gte: new Date(formDataWeekReference.toString()),
                },
              },
              select: {
                establishment: {
                  select: {
                    id: true,
                    name: true,
                    matrizId: true,
                  },
                },
                id: true,
                total: true,
                value_futebol: true,
              },
            });
            const arenaSite =
              reportSites[ReportCategory.ARENA_SITE].includes(formDataSite);
            const arena =
              reportSites[ReportCategory.ARENA].includes(formDataSite);
            const esportebet =
              reportSites[ReportCategory.BET].includes(formDataSite);
            const esportevip =
              reportSites[ReportCategory.VIP].includes(formDataSite);
            if (arenaSite) {
              const estabelecimentos = file as TFormattedReportArenaSite[];
              for await (const estabelecimento of estabelecimentos) {
                const premioDoBanco = importacao?.Premios.find(
                  (premioDoEstabelecimento) =>
                    premioDoEstabelecimento.establishment.name ===
                    estabelecimento.estabelecimento,
                );
                const premioDoArquivo = Number(
                  (estabelecimento.premios * 100).toFixed(),
                );

                if (premioDoBanco?.value === premioDoArquivo) continue;
                const caixasDoEstabelecimentos = caixas.filter(
                  (caixa) =>
                    caixa.establishment.name ===
                    estabelecimento.estabelecimento,
                );
                const liquidoDoBanco = importacao?.Liquido.find(
                  (liquindoDoEstabelecimento) =>
                    liquindoDoEstabelecimento.establishment.name ===
                    estabelecimento.estabelecimento,
                );

                const diferençaNoLiquido =
                  (liquidoDoBanco?.value || 0) -
                  Number((estabelecimento.liquido * 100).toFixed());
                console.log({ liquidoDoBanco });
                await liquidoService.update(liquidoDoBanco?.id as number, {
                  value: Number((estabelecimento.liquido * 100).toFixed()),
                  updatedAt: new Date(),
                });

                await premiosService.update(premioDoBanco?.id as number, {
                  value: premioDoArquivo,
                  updatedAt: new Date(),
                });

                await tx.caixa.updateMany({
                  where: {
                    id: {
                      in: caixasDoEstabelecimentos.map((item) => item.id),
                    },
                  },
                  data: {
                    total: {
                      decrement: diferençaNoLiquido,
                    },
                    value_futebol: {
                      decrement: diferençaNoLiquido,
                    },
                  },
                });
              }
              await importacaoService.atualizarImportacao(
                Number(formDataIdImportacao),
                {
                  state: "Atualizado",
                  modifiedBy: formDataUser.toString(),
                  updatedAt: new Date(),
                },
              );
            }
            if (esportevip || esportebet || arena) {
              const estabelecimentos = file as IFormattedReportSportNet[];

              for await (const estabelecimento of estabelecimentos) {
                const premioDoBanco = importacao?.Premios.find(
                  (premioDoEstabelecimento) =>
                    premioDoEstabelecimento.establishment.name ===
                    estabelecimento.Estabelecimento,
                );
                const premioDoArquivo = Number(
                  (estabelecimento["Prêmios/Saques"] * 100).toFixed(),
                );

                if (premioDoBanco?.value === premioDoArquivo) continue;
                const caixasDoEstabelecimentos = caixas.filter(
                  (caixa) =>
                    caixa.establishment.name ===
                    estabelecimento.Estabelecimento,
                );
                const liquidoDoBanco = importacao?.Liquido.find(
                  (liquindoDoEstabelecimento) =>
                    liquindoDoEstabelecimento.establishment.name ===
                    estabelecimento.Estabelecimento,
                );

                const diferençaNoLiquido =
                  (liquidoDoBanco?.value || 0) -
                  Number((estabelecimento.Líquido * 100).toFixed());
                console.log({ liquidoDoBanco });
                await liquidoService.update(liquidoDoBanco?.id as number, {
                  value: Number((estabelecimento.Líquido * 100).toFixed()),
                  updatedAt: new Date(),
                });

                await premiosService.update(premioDoBanco?.id as number, {
                  value: premioDoArquivo,
                  updatedAt: new Date(),
                });

                await tx.caixa.updateMany({
                  where: {
                    id: {
                      in: caixasDoEstabelecimentos.map((item) => item.id),
                    },
                  },
                  data: {
                    total: {
                      decrement: diferençaNoLiquido,
                    },
                    value_futebol: {
                      decrement: diferençaNoLiquido,
                    },
                  },
                });
              }
              await importacaoService.atualizarImportacao(
                Number(formDataIdImportacao),
                {
                  state: "Atualizado",
                  modifiedBy: formDataUser.toString(),
                  updatedAt: new Date(),
                },
              );
            }

            return { success: true, message: "Atualizado com sucesso" };
          } catch (err) {
            console.error(err);
            return { success: false, message: "Algo deu errado" };
          }
        },
        { timeout: 20000 },
      );

    const data = {
      status: 200,
      message: "Atualizado com sucesso",
    };
    if (!successAtualizacao)
      return new Response(messageAtualizacao, { status: 500 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    console.error("import delete", error);
    return new Response(null, { status: 500 });
  }
}
