import { Localidade, Prisma, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { TFormattedReportBingo } from "@/app/api/v1/types";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { prisma } from "@/services/prisma";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";

type TRespostaGravarDadosBingo =
  | {
      success: true;
      message: "Importado com sucesso";
    }
  | { success: false; message: string };

export const gravarDadosBingo = async (
  file: TFormattedReportBingo[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  localidadesNoBanco: Localidade[] | null,
  secaoNoBanco: Secao[] | null,
  importacaoId: number,
): Promise<TRespostaGravarDadosBingo> => {
  try {
    const { success, message } =
      await prisma.$transaction<TRespostaGravarDadosBingo>(async (tx) => {
        const localidadeDoArquivo = file[0].Localidade;
        const localidadeParaCriarNoBanco = localidadesNoBanco?.find(
          (item) => item.name === localidadeDoArquivo,
        );
        if (typeof localidadeParaCriarNoBanco?.id === "undefined") {
          await tx.localidade.create({
            data: {
              name: localidadeDoArquivo,
              empresa: {
                connect: {
                  name: company,
                },
              },
            },
          });
        }
        const seçõesDoArquivo = file.map((item) => item.Seção);
        const seçõesSemDuplicados = Array.from(new Set(seçõesDoArquivo));
        const seçoesParaCriarNoBanco = seçõesSemDuplicados.map((item) => {
          return {
            seção: item,
            criar: !secaoNoBanco?.find((secao) => secao.name === item),
          };
        });

        if (seçoesParaCriarNoBanco.length > 0) {
          for await (const item of seçoesParaCriarNoBanco) {
            if (item.criar) {
              await tx.secao.create({
                data: {
                  name: item.seção,
                  empresa: {
                    connect: {
                      name: company,
                    },
                  },
                },
              });
            }
          }
        }
        const rotasNoBanco = await tx.rota.findMany();
        const rotasDoArquivo = file.map((item) => item.Rota);
        const rotasSemDuplicados = Array.from(new Set(rotasDoArquivo));
        let rotasParaCriarNoBanco = rotasSemDuplicados.map((item) => {
          return {
            rota: item,
            criar: !rotasNoBanco?.find((rota) => rota.name === item),
          };
        });
        rotasParaCriarNoBanco = rotasParaCriarNoBanco.filter(
          (item) => item.criar,
        );

        if (rotasParaCriarNoBanco.length > 0) {
          for await (const item of rotasParaCriarNoBanco) {
            await tx.rota.create({
              data: {
                name: item.rota,
                empresa: {
                  connect: {
                    name: company,
                  },
                },
              },
            });
          }
        }

        const estabelecimentosDoArquivo = file.map((item) => {
          return {
            seção: item.Seção,
            rota: item.Rota,
            estabelecimento: item.Estabelecimento,
          };
        });
        const estabelecimentosSemDuplicados = Array.from(
          new Set(estabelecimentosDoArquivo),
        );
        const estabelecimentosParaCriarNoBanco =
          estabelecimentosSemDuplicados.map((item) => {
            return {
              estabelecimento: item.estabelecimento,
              seção: item.seção,
              rota: item.rota,

              criar: !estabelecimentosNoBanco?.find(
                (estabelecimento) =>
                  estabelecimento.name === item.estabelecimento,
              ),
            };
          });

        let estabelecimentosCriados = [];

        if (estabelecimentosParaCriarNoBanco.length > 0) {
          for await (const item of estabelecimentosParaCriarNoBanco) {
            if (item.criar) {
              const criado = await tx.estabelecimento.create({
                data: {
                  name: item.estabelecimento,
                  empresa: {
                    connect: {
                      name: company,
                    },
                  },
                  site,
                  localidade: {
                    connect: {
                      name: localidadeDoArquivo,
                    },
                  },
                  secao: {
                    connect: {
                      name: item.seção,
                    },
                  },
                  rota: {
                    connect: {
                      name: item.rota,
                    },
                  },
                },
              });
              estabelecimentosCriados.push(criado);
            }
          }
        }

        const estabelecimentosContitosNoBancoEArquivo =
          await tx.estabelecimento.findMany({
            where: {
              empresa: {
                name: company,
              },
              name: {
                in: estabelecimentosParaCriarNoBanco.map(
                  (item) => item.estabelecimento,
                ),
              },
            },
          });

        for await (const dadosParaGravarNoBanco of file) {
          let estabelecimento = estabelecimentosContitosNoBancoEArquivo.find(
            (item) => item.name === dadosParaGravarNoBanco.Estabelecimento,
          );

          if (typeof estabelecimento?.id === "undefined") {
            estabelecimento = await tx.estabelecimento.create({
              data: {
                name: dadosParaGravarNoBanco.Estabelecimento,
                site,
                empresa: {
                  connect: {
                    name: company,
                  },
                },
                localidade: {
                  connect: {
                    name: dadosParaGravarNoBanco.Localidade,
                  },
                },
                secao: {
                  connect: {
                    name: dadosParaGravarNoBanco.Seção,
                  },
                },
                rota: {
                  connect: {
                    name: dadosParaGravarNoBanco.Rota,
                  },
                },
              },
            });
          }
          const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(
            new Date(weekReference),
          );
          const resultadoCiclo = await tx.ciclo.findFirst({
            where: {
              reference_date: {
                gte: inicioDoCiclo,
                lte: finalDoCiclo,
              },
              establishment: {
                name: dadosParaGravarNoBanco.Estabelecimento,
              },
            },
          });

          if (!resultadoCiclo?.id) {
            await tx.ciclo.create({
              data: {
                reference_date: new Date(weekReference),
                establishmentId: estabelecimento.id,
                status: "PENDENTE",
              },
            });
          }
          console.log({ estabelecimento, importacaoId });
          await tx.vendas.create({
            data: {
              quantity: dadosParaGravarNoBanco.Quantidade,
              value: dadosParaGravarNoBanco.Vendas,
              site,
              importacaoId,
              referenceDate: new Date(weekReference),
              establishmentId: estabelecimento.id,
            },
          });
          await tx.comissao.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dadosParaGravarNoBanco.Comissão,
            },
          });
          await tx.premios.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dadosParaGravarNoBanco.Prêmio,
            },
          });
          await tx.liquido.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dadosParaGravarNoBanco.Líquido,
            },
          });
          const caixa = await tx.caixa.findFirst({
            where: {
              referenceDate: new Date(weekReference),
              establishmentId: estabelecimento.id,
            },
          });

          if (!caixa?.id) {
            await tx.caixa.create({
              data: {
                referenceDate: new Date(weekReference),
                importacaoId,
                establishmentId: estabelecimento.id,
                total: dadosParaGravarNoBanco.Líquido,
                status: "PENDENTE",
              },
            });
          } else {
            await tx.caixa.update({
              where: {
                id: caixa.id,
              },
              data: {
                total: {
                  increment: dadosParaGravarNoBanco.Líquido,
                },
              },
            });
          }
        }
        return { success: false, message: "Teste" };
        return { success: true, message: "Importado com sucesso" };
      });
    if (!success) {
      return {
        success,
        message,
      };
    }
    return { success, message };
  } catch (error) {
    if (
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: "Erro desconhecido",
      };
    }
  }
};
