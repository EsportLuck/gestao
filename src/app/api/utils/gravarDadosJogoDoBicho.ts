import { Localidade, Prisma, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { TReportJogoDoBicho } from "../v1/utils/feature";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";
import { obterDiaAnterior } from "../v1/utils/obterDiaAnterior";
import { formatarData } from "@/utils/formatarData";

export const gravarDadosJogoDoBicho = async (
  file: TReportJogoDoBicho[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  _user: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
  _localidadesNoBanco: Localidade[] | null,
  _secaoNoBanco: Secao[] | null,
  importacaoId: number,
  tx: Prisma.TransactionClient,
): Promise<
  | { success: true; message: "Importado com sucesso" }
  | { success: false; message: string }
> => {
  try {
    const estabelecimentosNaoExistentesNoBancoDeDados = file.filter(
      (relatorio) =>
        !estabelecimentosNoBanco?.find(
          (item) => item.name === relatorio.Estabelecimento,
        ),
    );
    for await (const relatorio of estabelecimentosNaoExistentesNoBancoDeDados) {
      await tx.estabelecimento.create({
        data: {
          name: relatorio.Estabelecimento,
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

    const todosEstabelecimentosNoBancoDeDados =
      await tx.estabelecimento.findMany({
        where: {
          empresa: {
            name: company,
          },
          name: {
            in: file.map((item) => item.Estabelecimento),
          },
        },
      });

    for await (const relatorio of file) {
      let estabelecimento = todosEstabelecimentosNoBancoDeDados?.find(
        (dado) => dado.name === relatorio.Estabelecimento,
      );
      if (!estabelecimento?.id) {
        estabelecimento = await tx.estabelecimento.create({
          data: {
            name: relatorio.Estabelecimento,
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
            site,
          },
        });
      }
      const validarComissaoRetida = estabelecimento.comissao_retida;
      const matrizId = estabelecimento.matrizId;
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
          value: validarComissaoRetida ? 0 : relatorio.Comissão,
          importacaoId,
          site,
        },
      });

      await tx.premios.create({
        data: {
          referenceDate: new Date(weekReference),
          establishmentId: estabelecimento.id,
          value: relatorio.Prêmios,
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
        const total = relatorio.Líquido + (caixaDoDiaAnterior?.total || 0);
        await tx.caixa.create({
          data: {
            referenceDate: new Date(weekReference),
            establishmentId: estabelecimento.id,
            total: validarComissaoRetida ? total + relatorio.Comissão : total,
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
              increment: validarComissaoRetida
                ? relatorio.Líquido + relatorio.Comissão
                : relatorio.Líquido,
            },
            value_futebol: {
              increment: relatorio.Líquido,
            },
          },
        });
      }
      if (typeof matrizId === "number") {
        const ciclo = await tx.ciclo.findFirst({
          where: {
            establishmentId: matrizId,
            reference_date: {
              gte: inicioDoCiclo,
              lte: finalDoCiclo,
            },
          },
        });
        if (typeof ciclo?.id !== "number") {
          await tx.ciclo.create({
            data: {
              reference_date: formatarData(weekReference.toISOString()),
              establishmentId: matrizId,
              status: "PENDENTE",
            },
          });
        }
        const caixaMatriz = await tx.caixa.findFirst({
          where: {
            referenceDate: new Date(weekReference),
            establishmentId: matrizId,
          },
        });
        const caixaDoDiaAnteriorMatriz = await tx.caixa.findFirst({
          where: {
            referenceDate: startOfDay,
            establishmentId: matrizId,
          },
        });
        if (typeof caixaMatriz?.id !== "number") {
          const total =
            relatorio.Líquido + (caixaDoDiaAnteriorMatriz?.total || 0);
          await tx.caixa.create({
            data: {
              referenceDate: weekReference,
              status: "PENDENTE",
              total: validarComissaoRetida ? total + relatorio.Comissão : total,
              importacaoId,
              value_loteria: relatorio.Líquido,
              loteria: site,
              establishmentId: matrizId,
            },
          });
        } else {
          await tx.caixa.update({
            where: {
              id: caixaMatriz.id,
            },
            data: {
              total: {
                increment: validarComissaoRetida
                  ? relatorio.Líquido + relatorio.Comissão
                  : relatorio.Líquido,
              },
              value_loteria: {
                increment: relatorio.Líquido,
              },
            },
          });
        }
      }
    }

    return { success: true, message: "Importado com sucesso" };
  } catch (error) {
    if (
      error instanceof Error ||
      error instanceof SyntaxError ||
      error instanceof TypeError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.error(" Erro no servidor importação Jogo do Bicho ", error);
      return { success: false, message: error.message };
    } else {
      console.error(" Erro no servidor importação Jogo do Bicho ", error);
      return { success: false, message: "Teste" };
    }
  }
};
