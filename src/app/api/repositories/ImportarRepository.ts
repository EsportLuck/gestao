import { prisma } from "@/services/prisma";
import { IImportacaoRepository } from "../contracts/Importacao";
import { Importacao, Prisma, PrismaClient } from "@prisma/client";

export class ImportarRepository implements IImportacaoRepository {
  async apagarImportacaoComDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<{ error: boolean; message: string }> {
    try {
      await prisma.importacao.deleteMany({
        where: {
          referenceDate: dataReferencia,
          relatorio: site,
        },
      });
      return { error: false, message: "Importação apagada com sucesso" };
    } catch (error) {
      console.error("deleteMany deleteMany", error);
      return { error: true, message: "Erro ao apagar importação" };
    }
  }
  async apagarImportacaoComId(
    id: number,
  ): Promise<{ error: boolean; message: string }> {
    try {
      await prisma.importacao.delete({
        where: {
          id,
        },
      });
      return { error: false, message: "Importação apagada com sucesso" };
    } catch (error) {
      console.error("deleteMany deleteMany", error);
      return { error: true, message: "Erro ao apagar importação" };
    }
  }
  async criarImportacao(
    dataReferencia: Date,
    site: string,
    user: string,
    dependencia: PrismaClient | Prisma.TransactionClient | undefined,
  ): Promise<{ error: boolean; message: string }> {
    const prismaLocal = dependencia || prisma;
    try {
      await prismaLocal.importacao.create({
        data: {
          name: user,
          referenceDate: dataReferencia,

          relatorio: site,
          state: "Importado",
        },
      });
      return { error: false, message: "Importado com sucesso" };
    } catch (error) {
      console.error("create import", error);
      return { error: true, message: "Erro ao criar importação" };
    }
  }
  lerInformacoesDoFormulario(form: FormData) {
    const weekReference = form.get("date")
      ? new Date(form.get("date") as string)
      : null;
    const data = {
      file: form.get("file") as File,
      weekReference,
      company: form.get("empresa") as string,
      site: form.get("site") as string,
      user: form.get("user") as string,
    };
    return { data };
  }
  async buscarPorImportacaoPorDataESite(dataReferencia: Date, site: string) {
    return await prisma.importacao.findFirst({
      where: {
        referenceDate: {
          equals: dataReferencia,
        },
        relatorio: {
          equals: site,
        },
        AND: {
          state: {
            equals: "Importado",
          },
        },
      },
    });
  }
  async atualizarImportacao(
    id: number,
    data: Partial<Importacao>,
  ): Promise<void> {
    try {
      await prisma.importacao.update({
        where: {
          id,
        },
        data,
      });
      return;
    } catch (error) {
      console.error("atualizarImportacao", error);
      return;
    }
  }
}
