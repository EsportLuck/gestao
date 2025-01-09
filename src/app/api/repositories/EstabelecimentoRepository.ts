import {
  IEstabelecimentoRepository,
  EstabelecimentoComLocalidadeSeção,
  EstabelecimentoSelecionado,
} from "@/app/api/contracts/Estabelecimento";
import { prisma } from "@/services/prisma";
import { Estabelecimento } from "@prisma/client";

export class EstabelecimentoRepository implements IEstabelecimentoRepository {
  async criar(data: EstabelecimentoComLocalidadeSeção): Promise<void> {
    const {
      localidadeIdParaConectar,
      secaoIdParaConectar,
      empresaIdParaConectar,
      ...rest
    } = data;
    await prisma.estabelecimento.create({
      data: {
        ...rest,
        ...(localidadeIdParaConectar && {
          localidadeId: localidadeIdParaConectar,
        }),
        ...(secaoIdParaConectar && { secaoId: secaoIdParaConectar }),
        ...(empresaIdParaConectar && { empresaId: empresaIdParaConectar }),
      },
    });
  }
  async editar(
    estabelecimentoId: number,
    data: Partial<Estabelecimento>,
  ): Promise<void> {
    await prisma.estabelecimento.update({
      where: {
        id: estabelecimentoId,
      },
      data,
    });
  }
  async encontrarPorId(
    estabelecimentoId: number,
  ): Promise<Estabelecimento | null> {
    return await prisma.estabelecimento.findUnique({
      where: {
        id: estabelecimentoId,
      },
    });
  }

  async encontrarPorNome(
    estabelecimentoNome: string,
  ): Promise<EstabelecimentoSelecionado | null> {
    return await prisma.estabelecimento.findUnique({
      where: {
        name: estabelecimentoNome,
      },
      select: {
        id: true,
        name: true,
        status_atividade: true,
        status_compromisso: true,
        localidadeId: true,
        matrizId: true,
        secaoId: true,
        rotaId: true,
        site: true,
        empresa: {
          select: {
            name: true,
          },
        },
        matriz: true,
        localidade: {
          select: {
            name: true,
          },
        },
        secao: {
          select: {
            name: true,
          },
        },
        rota: {
          select: {
            name: true,
          },
        },
        supervisor: {
          select: {
            name: true,
          },
        },
        vendas: true,
        filiais: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async encontrarMuitosEstabelecimentosPorSite(
    site: string,
  ): Promise<EstabelecimentoSelecionado[] | null> {
    return await prisma.estabelecimento.findMany({
      where: {
        site,
      },
      select: {
        id: true,
        name: true,
        status_atividade: true,
        status_compromisso: true,
        localidadeId: true,
        matrizId: true,
        secaoId: true,
        rotaId: true,
        site: true,
        empresa: {
          select: {
            name: true,
          },
        },
        matriz: true,
        localidade: {
          select: {
            name: true,
          },
        },
        secao: {
          select: {
            name: true,
          },
        },
        rota: {
          select: {
            name: true,
          },
        },
        supervisor: {
          select: {
            name: true,
          },
        },
        vendas: true,
        filiais: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async encontrarMuitosEstabelecimentosPorEmpresa(
    empresa: string,
  ): Promise<EstabelecimentoSelecionado[] | null> {
    return await prisma.estabelecimento.findMany({
      where: {
        empresa: {
          name: empresa,
        },
      },
      select: {
        id: true,
        name: true,
        status_atividade: true,
        status_compromisso: true,
        localidadeId: true,
        matrizId: true,
        secaoId: true,
        rotaId: true,
        site: true,
        empresa: {
          select: {
            name: true,
          },
        },
        matriz: true,
        localidade: {
          select: {
            name: true,
          },
        },
        secao: {
          select: {
            name: true,
          },
        },
        rota: {
          select: {
            name: true,
          },
        },
        supervisor: {
          select: {
            name: true,
          },
        },
        vendas: true,
        filiais: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async encontrarTodosOsEstabelecimentos(): Promise<Estabelecimento[]> {
    return await prisma.estabelecimento.findMany();
  }
}
