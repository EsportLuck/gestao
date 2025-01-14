import { Ciclo, Prisma, PrismaClient } from "@prisma/client";
import { ICicloService } from "@/app/api/contracts/ICicloService";
import { ICicloRepository } from "@/app/api/contracts/ICicloRepository";
import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";
import { formatarData } from "@/utils/formatarData";

export class CicloService implements ICicloService {
  constructor(private cicloRepository: ICicloRepository) {}

  async criar(
    establishmentId: number,
    reference_date: Date,
    matrizId: number | null,
    tx: Prisma.TransactionClient | PrismaClient,
  ): Promise<void> {
    const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(
      formatarData(reference_date.toISOString()),
    );
    try {
      const cicloExistente = await this.buscarCicloPorEstabelecimentoEData(
        establishmentId,
        inicioDoCiclo,
        finalDoCiclo,
      );
      if (matrizId) {
        const cicloExistenteMatriz =
          await this.buscarCicloPorEstabelecimentoEData(
            matrizId,
            inicioDoCiclo,
            finalDoCiclo,
          );
        if (cicloExistenteMatriz) return;
        await this.cicloRepository.criar(matrizId, reference_date, tx);
      }
      if (cicloExistente) return;
      await this.cicloRepository.criar(establishmentId, reference_date, tx);
    } catch (error) {
      console.error("criar cicloService criar", error);
    }
  }

  async atualizar(cicloId: number, status: string): Promise<void> {
    await this.cicloRepository.atualizar(cicloId, status);
  }

  async buscarCicloPorEstabelecimentoEData(
    establishmentId: number,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<Ciclo | null> {
    return this.cicloRepository.encontrarPorEstabelecimentoEData(
      establishmentId,
      dataInicial,
      dataFinal,
    );
  }
}
