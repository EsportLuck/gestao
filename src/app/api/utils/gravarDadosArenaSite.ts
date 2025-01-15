import { TFormattedReportArenaSite } from "@/app/api/v1/types";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { Estabelecimento, Localidade, Prisma, Secao } from "@prisma/client";
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
  tx: Prisma.TransactionClient,
) => {
  try {
    const { inicioDoCiclo: gte, finalDoCiclo: lte } =
      obterInicioEFimDoCiclo(weekReference);
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

    const consultarNoBanco = await tx.estabelecimento.findMany({
      where: {
        empresa: {
          name: company,
        },
        name: {
          in: file.map((item) => item.estabelecimento),
        },
      },
    });

    for await (const relatorio of file) {
      const estabelecimento = consultarNoBanco.find(
        (item) => item.name === relatorio.estabelecimento,
      );
      if (!estabelecimento) {
        return {
          success: false,
          message: "Algo deu errado na busca do estabelecimento",
        };
      }
      const validarComissaoRetida = estabelecimento.comissao_retida;
      await tx.vendas.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.vendas,
          site,
          quantity: relatorio.quantidade,
          importacaoId,
        },
      });
      await tx.comissao.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.comissao,
          site,
          importacaoId,
        },
      });
      await tx.premios.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.premios,
          site,
          importacaoId,
        },
      });
      await tx.liquido.create({
        data: {
          establishmentId: estabelecimento.id,
          referenceDate: new Date(weekReference),
          value: relatorio.liquido,
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
              ? relatorio.liquido +
                (ultimoCaixa?.total || 0) +
                relatorio.comissao
              : relatorio.liquido + (ultimoCaixa?.total || 0),
            importacaoId,
            status: "PENDENTE",
            value_futebol: relatorio.liquido,
          },
        });
      } else {
        await tx.caixa.update({
          where: {
            id: ultimoCaixa.id,
          },
          data: {
            value_futebol: {
              increment: relatorio.liquido,
            },
            total: {
              increment: validarComissaoRetida
                ? relatorio.liquido + relatorio.comissao
                : relatorio.liquido,
            },
          },
        });
      }
    }
    return { success: true, message: "Dados Importados" };
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
