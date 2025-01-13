import { Ciclo, Prisma, PrismaClient } from "@prisma/client";

export interface ICicloRepository {
  criar(
    establishmentId: number,
    reference_date: Date,
    tx: Prisma.TransactionClient | PrismaClient,
  ): Promise<void>;
  atualizar(cicloId: number, status: string): Promise<void>;
  encontrarPorEstabelecimentoEData(
    establishmentId: number,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<Ciclo | null>;
}
