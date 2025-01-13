import { Localidade, Prisma, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { EstabelecimentoService, LocalidadeService } from "@/app/api/services";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { TReportFratec } from "@/app/api/v1/types";
import {
  EstabelecimentoRepository,
  LocalidadeRepository,
} from "@/app/api/repositories";
import { prisma } from "@/services/prisma";
import { registerReportLoteria } from "../v1/utils/create";
import { obterDiaAnterior } from "../v1/utils/obterDiaAnterior";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";

export const gravarDadosLoteria = async (
  file: TReportFratec[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  localidadesNoBanco: Localidade[] | null,
  _secaoNoBanco: Secao[] | null,
  importacaoId: number,
  tx: Prisma.TransactionClient,
): Promise<
  | { success: true; message: "Importado com sucesso" }
  | { success: false; message: string }
> => {
  try {
    const localidadeNoArquivo = file[0].Localidade;
    let localidade = await tx.localidade.findUnique({
      where: {
        name: localidadeNoArquivo,
      },
    });

    if (typeof localidade?.id !== "number") {
      localidade = await tx.localidade.create({
        data: {
          name: localidadeNoArquivo,
          empresa: {
            connect: {
              name: company,
            },
          },
        },
      });
    }
    const estabelecimentosQueFaltaCriarNoBanco = file.filter(
      (estabelecimentoNoArquivo) =>
        !estabelecimentosNoBanco?.find(
          (item) => item.name === estabelecimentoNoArquivo.Nome,
        ),
    );
    if (estabelecimentosQueFaltaCriarNoBanco.length > 0) {
      for await (const estabelecimento of estabelecimentosQueFaltaCriarNoBanco) {
        await tx.estabelecimento.create({
          data: {
            name: estabelecimento.Nome,
            site,
            empresa: {
              connect: {
                name: company,
              },
            },
            localidade: {
              connect: {
                name: estabelecimento.Localidade,
              },
            },
            companies: {
              connect: {
                id: 1,
              },
            },
          },
        });
      }
    }
    const todosEstabelecimentosDoBanco = await tx.estabelecimento.findMany({
      where: {
        empresa: {
          name: company,
        },
      },
    });

    for await (const relatorio of file) {
      let estabelecimento = todosEstabelecimentosDoBanco.find(
        (item) => item.name === relatorio.Nome,
      );
      if (typeof estabelecimento?.id !== "number") {
        estabelecimento = await tx.estabelecimento.create({
          data: {
            name: relatorio.Nome,
            site,
            empresa: {
              connect: {
                name: company,
              },
            },
            companies: {
              connect: {
                id: 1,
              },
            },
          },
        });
      }
      const { inicioDoCiclo, finalDoCiclo } =
        obterInicioEFimDoCiclo(weekReference);
      const ciclo = await tx.ciclo.findFirst({
        where: {
          establishmentId: estabelecimento.id,
          reference_date: {
            gte: inicioDoCiclo,
            lte: finalDoCiclo,
          },
        },
      });

      if (!ciclo?.id) {
        await tx.ciclo.create({
          data: {
            reference_date: new Date(weekReference),
            status: "PENDENTE",
            establishmentId: estabelecimento.id,
          },
        });
      }

      await tx.vendas.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          quantity: 0,
          value: relatorio.Vendas,
          importacaoId,
          site,
        },
      });

      await tx.comissao.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.Comissão,
          importacaoId,
          site,
        },
      });

      await tx.premios.create({
        data: {
          referenceDate: new Date(weekReference),
          establishmentId: estabelecimento.id,
          value: relatorio["Prêmios Pagos"],
          site,
          importacaoId,
        },
      });

      await tx.liquido.create({
        data: {
          referenceDate: new Date(weekReference),
          establishmentId: estabelecimento.id,
          value: relatorio.Líquido,
          importacaoId,
          site,
        },
      });

      const caixa = await tx.caixa.findFirst({
        where: {
          referenceDate: new Date(weekReference),
          establishmentId: estabelecimento.id,
        },
      });
      const { startOfDay } = obterDiaAnterior(weekReference);
      const caixaDoDiaAnterior = await tx.caixa.findFirst({
        where: {
          referenceDate: startOfDay,
          establishmentId: estabelecimento.id,
        },
      });
      if (!caixa?.id) {
        await tx.caixa.create({
          data: {
            referenceDate: new Date(weekReference),
            establishmentId: estabelecimento.id,
            total: relatorio.Líquido + (caixaDoDiaAnterior?.total || 0),
            importacaoId,
            status: "PENDENTE",
            value_futebol: relatorio.Líquido,
            futebol: site,
          },
        });
      } else {
        await tx.caixa.update({
          where: {
            id: caixa.id,
          },
          data: {
            total: {
              increment: relatorio.Líquido,
            },
            value_futebol: {
              increment: relatorio.Líquido,
            },
          },
        });
      }
    }
    return { success: true, message: "Importado com sucesso" };
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Error desconhecido" };
    }
  }
};
