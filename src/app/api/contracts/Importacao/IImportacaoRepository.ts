import { Importacao, Prisma, PrismaClient } from "@prisma/client";

export type dadosDoFormulario = {
  file: File;
  weekReference: Date | null;
  company: string;
  site: string;
  user: string;
};

export interface IImportacaoRepository {
  lerInformacoesDoFormulario(form: FormData): { data: dadosDoFormulario };
  buscarPorImportacaoPorDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<Partial<Importacao> | null>;
  criarImportacao(
    dataReferencia: Date,
    site: string,
    user: string,
    dependencia: PrismaClient | Prisma.TransactionClient,
  ): Promise<{ error: boolean; message: string }>;
  apagarImportacaoComDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<{ error: boolean; message: string }>;
  apagarImportacaoComId(
    id: number,
  ): Promise<{ error: boolean; message: string }>;
  atualizarImportacao(id: number, data: Partial<Importacao>): Promise<void>;
}
