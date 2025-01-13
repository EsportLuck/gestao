import { TFormattedReportArenaSite } from "@/app/api/v1/types";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { Estabelecimento, Localidade, Prisma, Secao } from "@prisma/client";
import { prisma } from "@/services/prisma";
import { formatarData } from "@/utils/formatarData";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";

export const gravarDadosArenaSite = async (
  file: TFormattedReportArenaSite[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  _localidadesNoBanco: Localidade[] | null,
  _secaoNoBanco: Secao[] | null,
  importacaoId: number,
) => {
  try {
    const { inicioDoCiclo: gte, finalDoCiclo: lte } =
      obterInicioEFimDoCiclo(weekReference);
    const { success, message } = await prisma.$transaction(
      async (tx) => {
        const estabelecimentosQueNaoExisteNoBancoDeDados = file?.filter(
          (estabelecimento) =>
            estabelecimentosNoBanco?.find(
              (estabelecimentoNoBanco) =>
                estabelecimentoNoBanco.name?.trim().toLowerCase() ===
                estabelecimento.estabelecimento.trim().toLowerCase(),
            ) === undefined,
        );
        let resultados_criados: Estabelecimento[] = [];
        if (estabelecimentosQueNaoExisteNoBancoDeDados.length > 0) {
          for await (const dado of estabelecimentosQueNaoExisteNoBancoDeDados) {
            const result = await tx.estabelecimento.create({
              data: {
                name: dado.estabelecimento,
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
            resultados_criados.push(result);
          }
        }

        const estabelecimentosQuePrecisamSerConsultadosNoBanco = file.filter(
          (estabelecimento) => {
            if (resultados_criados.length === 0) {
              return true;
            }

            return !resultados_criados.find(
              (item) => item.name === estabelecimento.estabelecimento,
            );
          },
        );
        const consultarNoBanco = await tx.estabelecimento.findMany({
          where: {
            name: {
              in: estabelecimentosQuePrecisamSerConsultadosNoBanco.map(
                (item) => item.estabelecimento,
              ),
            },
          },
        });

        const dadosDosEstabelecimentosNoBancoDeDados = [
          ...resultados_criados,
          ...consultarNoBanco,
        ];
        for await (const dado of file) {
          const dadosDoEstabelecimentoNoBancoDeDados =
            dadosDosEstabelecimentosNoBancoDeDados.find(
              (item) => item.name === dado.estabelecimento,
            );
          if (!dadosDoEstabelecimentoNoBancoDeDados) {
            return {
              success: false,
              message: "Algo deu errado na busca do estabelecimento",
            };
          }
          await tx.vendas.create({
            data: {
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
              referenceDate: new Date(weekReference),
              value: dado.vendas,
              site,
              quantity: dado.quantidade,
              importacaoId,
            },
          });
          await tx.comissao.create({
            data: {
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
              referenceDate: new Date(weekReference),
              value: dado.comissao,
              site,
              importacaoId,
            },
          });
          await tx.premios.create({
            data: {
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
              referenceDate: new Date(weekReference),
              value: dado.premios,
              site,
              importacaoId,
            },
          });
          await tx.liquido.create({
            data: {
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
              referenceDate: new Date(weekReference),
              value: dado.liquido,
              site,
              importacaoId,
            },
          });
          const ultimoCaixa = await tx.caixa.findFirst({
            where: {
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
            },
            orderBy: {
              referenceDate: "desc",
            },
          });

          const ciclo = await tx.ciclo.findFirst({
            where: {
              reference_date: {
                gte,
                lte,
              },
              establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
            },
          });

          if (!ciclo?.id) {
            await tx.ciclo.create({
              data: {
                reference_date: formatarData(weekReference.toISOString()),
                establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
                status: "PENDENTE",
              },
            });
          }

          if (
            ultimoCaixa?.referenceDate.getUTCDate() !==
            formatarData(weekReference.toISOString()).getUTCDate()
          ) {
            await tx.caixa.create({
              data: {
                establishmentId: dadosDoEstabelecimentoNoBancoDeDados.id,
                referenceDate: new Date(weekReference),
                total: dadosDoEstabelecimentoNoBancoDeDados.comissao_retida
                  ? dado.liquido + (ultimoCaixa?.total || 0) + dado.comissao
                  : dado.liquido + (ultimoCaixa?.total || 0),
                importacaoId,
                status: "PENDENTE",
                value_futebol: dado.liquido,
              },
            });
          } else {
            await tx.caixa.update({
              where: {
                id: ultimoCaixa.id,
              },
              data: {
                value_futebol: {
                  increment: dado.liquido,
                },
                total: {
                  increment:
                    dadosDoEstabelecimentoNoBancoDeDados.comissao_retida
                      ? dado.liquido + dado.comissao
                      : dado.liquido,
                },
              },
            });
          }
        }
        return { success: true, message: "Dados Importados" };
      },
      { maxWait: 20000 },
    );
    return { success, message };
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      console.error(" Erro no servidor importação Arena Site ", error);
      return { success: false, message: "Erro interno do servidor" };
    }
  }
};
