import { prisma } from "@/services/prisma";
import { Lancamentos, Prisma } from "@prisma/client";
import { put } from "@vercel/blob";

interface EnteringData {
  data_inicial?: string;
  data_final?: string;
  data_reference?: Date;
  estabelecimento?: string;
  observacao_comprovante?: string;
  comprovante?: File;
  value?: number;
  enteringId?: number;
  estabelecimentoId?: number;
  tipo?: "despesa" | "pagamento" | "recebimento";
  forma_pagamento?: "dinheiro" | "pix";
  status?: "analise" | "aprovado" | "reprovado";
  recorded_by?: string;
  approved_by?: string;
  empresaId?: number;
}

export class Entering {
  private data: EnteringData;

  constructor(data: EnteringData) {
    this.data = data;
  }

  async create() {
    try {
      const {
        data_reference,
        forma_pagamento,
        observacao_comprovante,
        comprovante,
        value,
        tipo,
        estabelecimentoId,
        recorded_by,
        empresaId,
      } = this.data;

      if (
        typeof data_reference !== "object" ||
        typeof forma_pagamento !== "string" ||
        typeof observacao_comprovante !== "string" ||
        typeof value !== "number" ||
        typeof tipo !== "string" ||
        typeof estabelecimentoId !== "number" ||
        typeof recorded_by !== "string" ||
        !comprovante ||
        !empresaId
      ) {
        return { message: "Dados inválidos" };
      }
      const dataArr = data_reference.toLocaleDateString("pt-BR").split("/");

      let blob = await put(comprovante.name, comprovante, {
        access: "public",
      });
      const url = blob.url;
      const downloadUrl = blob.downloadUrl;
      const createdEntering = await prisma.lancamentos.create({
        data: {
          referenceDate: new Date(`${dataArr[1]} ${dataArr[0]} ${dataArr[2]}`),
          paymentMethod: forma_pagamento,
          value: value * 100,
          type: tipo,
          establishmentId: estabelecimentoId,
          status: "analise",
          recorded_by,
          downloadUrl,
          url,
          empresaId,
        },
      });

      await prisma.observacao.create({
        data: {
          comentario: observacao_comprovante,
          lancamentoId: createdEntering.id,
          createdBy: recorded_by,
        },
      });

      return { message: "Lançamento criado com sucesso" };
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { message: error.message };
      }
      return { message: "Erro Interno do servidor" };
    }
  }
  async read(): Promise<Lancamentos | null> {
    try {
      const { enteringId } = this.data;
      return await prisma.lancamentos.findUnique({
        where: {
          id: enteringId,
        },
      });
    } catch (error) {
      throw new Error("Encontrar lançamento");
    }
  }
  async readAll(): Promise<Partial<Lancamentos>[] | null> {
    try {
      const {
        data_inicial,
        data_final,
        estabelecimento,
        tipo,
        forma_pagamento,
      } = this.data;
      const lte = data_final?.replace(/03:00:00/, "23:59:59");
      const data = await prisma.lancamentos.findMany({
        where: {
          createdAt: {
            gte: new Date(data_inicial as string).toISOString(),
            lte,
          },
        },

        select: {
          establishment: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          createdAt: true,
          type: true,
          observation: true,
          paymentMethod: true,
          value: true,
          referenceDate: true,
          status: true,
          recorded_by: true,
          url: true,
          downloadUrl: true,
        },
      });
      let filtros = data.map((items) => {
        return {
          id: items.id,
          status: items.status,
          data: items.referenceDate,
          valor: items.value / 100,
          url: items.url,
          downloadUrl: items.downloadUrl,
          responsavel: items.recorded_by,
          estabelecimento: items.establishment.name,
          tipo: items.type,
          estabelecimento_id: items.establishment.id,
          forma_pagamento: items.paymentMethod,
        };
      });

      if (estabelecimento)
        filtros = filtros.filter(
          (item) => item.estabelecimento === estabelecimento,
        );
      if (tipo) filtros = filtros.filter((item) => item.tipo === tipo);
      if (forma_pagamento)
        filtros = filtros.filter(
          (item) => item.forma_pagamento === forma_pagamento,
        );
      return filtros;
    } catch (error) {
      console.error("Entering readAll", error);
      throw new Error("Erro ao ler lançamento");
    } finally {
      await prisma.$disconnect();
    }
  }
  async readWeek(): Promise<Partial<Lancamentos>[] | null> {
    try {
      const { data_inicial, estabelecimento, tipo, forma_pagamento } =
        this.data;
      let getDate = data_inicial?.toString().replace(/T.+Z/, "").split("-");
      const [year, mon, day] = getDate as string[];

      const currentDate = new Date(Number(year), Number(mon) - 1, Number(day));
      const lte = new Date(Number(year), Number(mon) - 1, Number(day));
      lte.setDate(lte.getDate() + 6);
      lte.setUTCHours(23, 59, 59, 999);

      const data = await prisma.lancamentos.findMany({
        where: {
          referenceDate: {
            gte: currentDate,
            lte,
          },
        },

        select: {
          establishment: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          createdAt: true,
          type: true,
          observation: true,
          paymentMethod: true,
          value: true,
          referenceDate: true,
          status: true,
          url: true,
          downloadUrl: true,
          recorded_by: true,
          id_ciclo: true,
        },
      });
      let filtros = data.map((items) => {
        return {
          id: items.id,
          status: items.status,
          data: items.referenceDate,
          valor: items.value / 100,
          url: items.url,
          downloadUrl: items.downloadUrl,
          responsavel: items.recorded_by,
          estabelecimento: items.establishment.name,
          tipo: items.type,
          estabelecimento_id: items.establishment.id,
          forma_pagamento: items.paymentMethod,
          observacoes: items.observation,
          id_ciclo: items.id_ciclo,
        };
      });

      if (estabelecimento)
        filtros = filtros.filter(
          (item) => item.estabelecimento === estabelecimento,
        );
      if (tipo) filtros = filtros.filter((item) => item.tipo === tipo);
      if (forma_pagamento)
        filtros = filtros.filter(
          (item) => item.forma_pagamento === forma_pagamento,
        );
      return filtros;
    } catch (error) {
      console.error("Entering read week", error);
      throw new Error("Erro ao ler semanda de lançamento");
    } finally {
      await prisma.$disconnect();
    }
  }
  async readWithReleaseDateOf(): Promise<Partial<Lancamentos>[] | null> {
    try {
      const { data_final, estabelecimento, tipo, forma_pagamento } = this.data;
      let getDate = data_final?.toString().replace(/T.+Z/, "").split("-");
      const [year, mon, day] = getDate as string[];
      const gte = new Date(Number(year), Number(mon) - 1, Number(day));
      const lte = new Date(Number(year), Number(mon) - 1, Number(day));
      lte.setUTCHours(23, 59, 59, 999);
      const data = await prisma.lancamentos.findMany({
        where: {
          referenceDate: {
            gte,
            lte,
          },
        },

        select: {
          establishment: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          createdAt: true,
          type: true,
          observation: true,
          paymentMethod: true,
          value: true,
          referenceDate: true,
          status: true,
          url: true,
          downloadUrl: true,
          recorded_by: true,
          id_ciclo: true,
        },
      });

      let filtros = data.map((items) => {
        return {
          id: items.id,
          status: items.status,
          data: items.referenceDate,
          valor: items.value / 100,
          url: items.url,
          downloadUrl: items.downloadUrl,
          responsavel: items.recorded_by,
          estabelecimento: items.establishment.name,
          tipo: items.type,
          estabelecimento_id: items.establishment.id,
          forma_pagamento: items.paymentMethod,
          observacoes: items.observation,
          id_ciclo: items.id_ciclo,
        };
      });

      if (estabelecimento)
        filtros = filtros.filter(
          (item) => item.estabelecimento === estabelecimento,
        );
      if (tipo) filtros = filtros.filter((item) => item.tipo === tipo);
      if (forma_pagamento)
        filtros = filtros.filter(
          (item) => item.forma_pagamento === forma_pagamento,
        );
      return filtros;
    } catch (error) {
      console.error("entering read With Release Date Of", error);
      throw new Error("Erro ao ler todos o lançamento do dia");
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(id: number, newData: EnteringData): Promise<Lancamentos> {
    try {
      return await prisma.lancamentos.update({
        where: {
          id,
        },
        data: newData,
      });
    } catch (error) {
      console.error("Erro ao atualizar lançamento:", error);
      throw new Error("Erro ao atualizar lançamento");
    } finally {
      await prisma.$disconnect();
    }
  }
  async toFloat(
    id: number,
    newData: EnteringData,
    action: "aprovado" | "reprovado",
  ): Promise<Lancamentos> {
    try {
      return await prisma.lancamentos.update({
        where: {
          id,
        },
        data: {
          status: action,
          updatedAt: new Date(),
          approved_by: newData.approved_by,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar lançamento:", error);
      throw new Error("Erro ao atualizar lançamento");
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: number): Promise<Lancamentos> {
    try {
      return await prisma.lancamentos.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
      throw new Error("Erro ao deletar lançamento");
    } finally {
      await prisma.$disconnect();
    }
  }
}
