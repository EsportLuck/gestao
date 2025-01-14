import { prisma } from "@/services/prisma";
import { Localidade, Prisma, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { TReportAtena } from "@/app/api/v1/types";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";
import { formatarData } from "@/utils/formatarData";

export const gravaDadosFutebol = async (
  file: TReportAtena[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[],
  localidadesNoBanco: Localidade[],
  secaoNoBanco: Secao[],
  importacaoId: number,
  tx: Prisma.TransactionClient,
) => {
  try {
    const { localidadesSuccess } = await criarLocalidadesInexistentes(
      localidadesNoBanco,
      file.map((item) => {
        return {
          name: item.Localidade,
          empresa: { connect: { name: company } },
        };
      }),
      tx,
    );
    const { secaoSuccess } = await criarSecaoInexistentes(
      secaoNoBanco,
      file.map((item) => {
        return {
          name: item.Seção,
          localidade: { connect: { name: item.Localidade } },
          empresa: { connect: { name: company } },
        };
      }),
      localidadesSuccess,
      tx,
    );

    const { estabelecimentosSuccess } = await criarEstabelecimentosInexistentes(
      estabelecimentosNoBanco,
      file.map((item) => {
        return {
          name: item.Estabelecimento,
          site,
          empresa: {
            connect: { name: company },
          },
          companies: {
            connect: {
              id: 1,
            },
          },
          localidade: {
            connect: {
              name: item.Localidade,
            },
          },
          secao: {
            connect: {
              name: item.Seção,
            },
          },
        };
      }),
      localidadesSuccess,
      secaoSuccess,
      tx,
    );

    if (!localidadesSuccess || !secaoSuccess || !estabelecimentosSuccess)
      return { success: false, message: "Algo deu errado na criação de dados" };

    const todosOsEstabelecimentosNoBanco = await tx.estabelecimento.findMany({
      where: {
        name: {
          in: file.map((item) => item.Estabelecimento),
        },
      },
    });

    for await (const relatorio of file) {
      let estabelecimento = todosOsEstabelecimentosNoBanco.find(
        (item) => item.name === relatorio.Estabelecimento,
      );
      if (!estabelecimento?.id) {
        estabelecimento = await tx.estabelecimento.create({
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
            localidade: {
              connect: {
                name: relatorio.Localidade,
              },
            },
            secao: {
              connect: {
                name: relatorio.Seção,
              },
            },
          },
        });
      }
      const validarComissaoRetida = estabelecimento.comissao_retida;

      await tx.vendas.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.Vendas,
          site,
          quantity: relatorio.Quantidade,
          importacaoId,
        },
      });
      await tx.comissao.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.Comissão,
          site,
          importacaoId,
        },
      });
      await tx.premios.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio["Prêmios/Saques"],
          site,
          importacaoId,
        },
      });
      await tx.liquido.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.Líquido,
          site,
          importacaoId,
        },
      });
      const ultimoCaixa = await tx.caixa.findFirst({
        where: {
          establishmentId: estabelecimento.id,
        },
        orderBy: {
          referenceDate: "desc",
        },
      });
      const { inicioDoCiclo: gte, finalDoCiclo: lte } =
        obterInicioEFimDoCiclo(weekReference);

      const ciclo = await tx.ciclo.findFirst({
        where: {
          reference_date: {
            gte,
            lte,
          },
          establishmentId: estabelecimento.id,
        },
      });

      if (!ciclo?.id) {
        await tx.ciclo.create({
          data: {
            reference_date: formatarData(weekReference.toISOString()),
            establishmentId: estabelecimento.id,
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
            establishmentId: estabelecimento.id,
            referenceDate: new Date(weekReference),
            total: validarComissaoRetida
              ? relatorio.Líquido +
                (ultimoCaixa?.total || 0) +
                relatorio.Comissão
              : relatorio.Líquido + (ultimoCaixa?.total || 0),
            importacaoId,
            status: "PENDENTE",
            value_futebol: relatorio.Líquido,
          },
        });
      } else {
        await tx.caixa.update({
          where: {
            id: ultimoCaixa.id,
          },
          data: {
            value_futebol: {
              increment: relatorio.Líquido,
            },
            total: {
              increment: validarComissaoRetida
                ? relatorio.Líquido + relatorio.Comissão
                : relatorio.Líquido,
            },
          },
        });
      }
    }

    return { success: true, message: "Dados importados com sucesso" };
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
      console.error(" Erro no servidor importação Futebol ", error.message);
      return {
        sucess: false,
        message: error.message,
      };
    } else {
      console.error(" Erro no servidor importação Futebol ", error);
      return { success: false, message: "Erro desconhecido" };
    }
  }
};

const criarLocalidadesInexistentes = async (
  localidadesNoBanco: Localidade[] | [],
  localidadesNoArquivo: {
    name: string;
    empresa: {
      connect: {
        name: string;
      };
    };
  }[],
  tx: Prisma.TransactionClient,
) => {
  try {
    const localidadesSemRepetir = localidadesNoArquivo.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );

    const localidadesParaCriar = localidadesSemRepetir.filter(
      (item) =>
        !localidadesNoBanco.find((localidade) => localidade.name === item.name),
    );

    for (const item of localidadesParaCriar) {
      await tx.localidade.create({
        data: {
          name: item.name,
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
        },
      });
    }
    return { localidadesSuccess: true };
  } catch (error) {
    console.error(error);
    return { localidadesSuccess: false };
  }
};

const criarSecaoInexistentes = async (
  secaoNoBanco: Secao[],
  secaoNoArquivo: {
    name: string;
    localidade: {
      connect: {
        name: string;
      };
    };
    empresa: {
      connect: {
        name: string;
      };
    };
  }[],
  localidadesSuccess: boolean,
  tx: Prisma.TransactionClient,
) => {
  try {
    if (!localidadesSuccess) return { secaoSuccess: false };

    const secaoSemRepetir = secaoNoArquivo.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );
    const secaoParaCriar = secaoSemRepetir.filter((item) => {
      return !secaoNoBanco.find((secao) => secao.name === item.name);
    });

    for (const item of secaoParaCriar) {
      await tx.secao.create({
        data: {
          name: item.name,
          Localidade: {
            connect: {
              name: item.localidade.connect.name,
            },
          },
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
        },
      });
    }

    return { secaoSuccess: true };
  } catch (error) {
    console.error(error);
    return { secaoSuccess: false };
  }
};

const criarEstabelecimentosInexistentes = async (
  estabelecimentosNoBanco: EstabelecimentoSelecionado[],
  estabelecimentosNoArquivo: {
    name: string;
    site: string;
    empresa: {
      connect: {
        name: string;
      };
    };
    localidade: {
      connect: {
        name: string;
      };
    };
    secao: {
      connect: {
        name: string;
      };
    };
  }[],
  localidadesSuccess: boolean,
  secaoSuccess: boolean,
  tx: Prisma.TransactionClient,
) => {
  try {
    if (!localidadesSuccess || !secaoSuccess)
      return { estabelecimentosSuccess: false };

    const estabelecimentosParaCriar = estabelecimentosNoArquivo.filter(
      (item) =>
        !estabelecimentosNoBanco.find(
          (estabelecimento) => estabelecimento.name === item.name.trim(),
        ),
    );

    for (const item of estabelecimentosParaCriar) {
      await tx.estabelecimento.create({
        data: {
          name: item.name.trim(),
          site: item.site,
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
          companies: {
            connect: {
              id: 1,
            },
          },
          localidade: {
            connect: {
              name: item.localidade.connect.name,
            },
          },
          secao: {
            connect: {
              name: item.secao.connect.name,
            },
          },
        },
      });
    }
    return { estabelecimentosSuccess: true };
  } catch (error) {
    console.error(error);
    return { estabelecimentosSuccess: false };
  }
};
