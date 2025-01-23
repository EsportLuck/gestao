import { prisma } from "@/services/prisma";
import { NextRequest } from "next/server";
import { seNaoExistiValorRetornarZero } from "@/utils";
import { obterCicloAnterioEAtual } from "../v1/utils/obterCicloAnterioEAtual";
interface StatusPagamento {
  status: string;
  reference_date: Date;
}
interface IConsultaDB {
  id: number;
  name: string;
  status_atividade: string;
  status_pagamento: StatusPagamento[] | null;
  status_compromisso: number | null;
  comissao_retida: boolean | null;
  localidadeId: number | null;
  matrizId: number | null;
  secaoId: number | null;
  rotaId: number | null;
  supervisorId: number | null;
  site: string | null;
  empresa: string | null;
  matriz: string | null;
  localidade: string | null;
  secao: string | null;
  rota: string | null;
  supervisor: string | null;
  vendas: number;
  quantidade: number;
  comissao: number;
  premios: number;
  liquido: number;
  despesas: number;
  sangria: number;
  deposito: number;
  caixa: number;
  prestacao: number;
  negativo: number;
}

export interface ISomaMovimentacaoDasFiliais {
  vendas: number;
  comissao: number;
  premios: number;
  liquido: number;
}

export class ExtratoController {
  obterDadosDoFormulario(req: NextRequest) {
    const dataInicial = new Date(
      req.nextUrl.searchParams.get("dataInicial") as string,
    );
    const dataFinal = new Date(
      req.nextUrl.searchParams.get("dataFinal") as string,
    );
    let localidade = req.nextUrl.searchParams.get("localidade");
    let secao = req.nextUrl.searchParams.get("secao");
    let rota = req.nextUrl.searchParams.get("rota");
    let estabelecimento = req.nextUrl.searchParams.get("estabelecimento");
    let role = req.nextUrl.searchParams.get("role");
    let username = req.nextUrl.searchParams.get("username");
    let site = req.nextUrl.searchParams.get("site");
    let empresa = req.nextUrl.searchParams.get("empresa");
    let supervisor = req.nextUrl.searchParams.get("supervisor");

    function converterStringUndefinedParaNull(variable: string) {
      return variable === "undefined" ? null : variable;
    }
    localidade = converterStringUndefinedParaNull(localidade as string);
    secao = converterStringUndefinedParaNull(secao as string);
    rota = converterStringUndefinedParaNull(rota as string);
    estabelecimento = converterStringUndefinedParaNull(
      estabelecimento as string,
    );
    role = converterStringUndefinedParaNull(role as string);
    username = converterStringUndefinedParaNull(username as string);
    supervisor = converterStringUndefinedParaNull(supervisor as string);
    site = converterStringUndefinedParaNull(site as string);
    empresa = converterStringUndefinedParaNull(empresa as string);

    return {
      dataInicial,
      dataFinal,
      localidade,
      secao,
      rota,
      supervisor,
      estabelecimento,
      role,
      username,
      site,
      empresa,
    };
  }

  async obterEstabelecimentosDoBancoDeDados(
    req: NextRequest,
  ): Promise<IConsultaDB[] | [] | undefined> {
    const { dataInicial, dataFinal } = this.obterDadosDoFormulario(req);
    try {
      const dadosDosEstabelecimentos = await prisma.estabelecimento.findMany({
        select: {
          id: true,
          name: true,
          status_atividade: true,
          status_compromisso: true,
          localidadeId: true,
          comissao_retida: true,
          localidade: {
            select: {
              name: true,
            },
          },
          secaoId: true,
          secao: {
            select: {
              name: true,
            },
          },
          rotaId: true,
          rota: {
            select: {
              name: true,
            },
          },
          supervisorId: true,
          supervisor: {
            select: {
              name: true,
            },
          },
          site: true,
          empresa: {
            select: {
              id: true,
              name: true,
            },
          },
          matrizId: true,
          matriz: {
            select: {
              name: true,
            },
          },

          ciclo_pagamento: {
            select: {
              status: true,
              reference_date: true,
            },
            where: {
              status: "PENDENTE",
            },
          },
          prestacao: {
            select: {
              value: true,
              referenceDate: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          negativo: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          vendas: {
            select: {
              value: true,
              quantity: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          comissao: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          premios: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          liquido: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          despesas: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          sangria: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          deposito: {
            select: {
              value: true,
            },
            where: {
              referenceDate: {
                gte: dataInicial,
                lte: dataFinal,
              },
            },
          },
          caixa: {
            select: {
              value_bicho: true,
              value_futebol: true,
              value_loteria: true,
              total: true,
            },
            where: {
              referenceDate: {
                lte: dataFinal,
                gte: dataInicial,
              },
            },
            orderBy: {
              referenceDate: "asc",
            },
          },
        },
      });
      const estabelecimentos = dadosDosEstabelecimentos.map((dados) => {
        const status_pagamento = dados.ciclo_pagamento?.map((ciclo) => {
          return {
            status: ciclo.status,
            reference_date: ciclo.reference_date,
          };
        });
        const vendas =
          dados.vendas.reduce((acumulador, venda) => {
            return acumulador + venda.value;
          }, 0) / 100;
        const quantidade = dados.vendas.reduce((acumulador, venda) => {
          return acumulador + venda.quantity;
        }, 0);
        const comissao =
          dados.comissao.reduce((acumulador, comissao) => {
            return acumulador + comissao.value;
          }, 0) / 100;
        const premios =
          dados.premios.reduce((acumulador, premio) => {
            return acumulador + premio.value;
          }, 0) / 100;
        const liquido =
          dados.liquido.reduce((acumulador, liquido) => {
            return acumulador + liquido.value;
          }, 0) / 100;
        const despesas =
          dados.despesas.reduce((acumulador, despesa) => {
            return acumulador + despesa.value;
          }, 0) / 100;
        const sangria =
          dados.sangria.reduce((acumulador, sangria) => {
            return acumulador + sangria.value;
          }, 0) / 100;
        const deposito =
          dados.deposito.reduce((acumulador, deposito) => {
            return acumulador + deposito.value;
          }, 0) / 100;
        const prestacao =
          dados.prestacao.reduce((acumulador, prestacao) => {
            return acumulador + prestacao.value;
          }, 0) / 100;
        const negativo =
          dados.negativo.reduce((acumulador, negativo) => {
            return acumulador + negativo.value;
          }, 0) / 100;
        const caixa =
          seNaoExistiValorRetornarZero(dados.caixa.pop()?.total) / 100;

        return {
          id: dados.id,
          name: dados.name,
          status_atividade: dados.status_atividade,
          status_pagamento,
          comissao_retida: dados.comissao_retida,
          status_compromisso: dados.status_compromisso,
          localidadeId: dados.localidadeId,
          matrizId: dados.matrizId,
          secaoId: dados.secaoId,
          rotaId: dados.rotaId,
          supervisorId: dados.supervisorId,
          site: dados.site,
          empresa: dados.empresa?.name || null,
          matriz: dados.matriz?.name || null,
          localidade: dados.localidade?.name || null,
          secao: dados.secao?.name || null,
          rota: dados.rota?.name || null,
          supervisor: dados.supervisor?.name || null,
          vendas,
          quantidade,
          comissao,
          premios,
          liquido,
          despesas,
          sangria,
          deposito,
          caixa,
          prestacao,
          negativo,
        };
      });

      return estabelecimentos;
    } catch (error) {
      console.error("obterEstabelecimentosDoBancoDeDados", error);
    } finally {
      await prisma.$disconnect();
    }
  }
}
