import { IDepositoService } from "@/app/api/contracts/Deposito";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/services/prisma";

export class DepositoService implements IDepositoService {
  #db: PrismaClient;

  constructor(db: PrismaClient) {
    this.#db = db; // Inicialização correta do campo privado
  }
  async usecase(
    id: string,
    status: string,
    establishmentId: string,
    referenceDate: string,
    type: string,
    value: number,
    status_action: string,
  ): Promise<{ sucess: boolean; message: string }> {
    const deposito = await this.#db.deposito.create({
      data: {
        referenceDate: new Date(referenceDate),
        establishmentId: Number(establishmentId),
        value: value * 100,
      },
    });
    try {
      return { sucess: true, message: "Deposito realizado com sucesso" };
    } catch (error) {
      return { sucess: false, message: "Erro ao realizar a transação" };
    }
  }
}

function createDepositoService(
  id: string,
  status: string,
  establishmentId: string,
  referenceDate: string,
  type: string,
  value: number,
  status_action: string,
  db?: PrismaClient | Prisma.TransactionClient,
) {
  return { sucess: true, message: "Deposito realizado com sucesso" };
}
