import { Ciclo } from "@prisma/client";

export interface ICicloService {
  criar(
    establishmentId: number,
    reference_date: Date,
    matrizId: number | null,
  ): Promise<void>;
  atualizar(cicloId: number, status: string): Promise<void>;
  buscarCicloPorEstabelecimentoEData(
    establishmentId: number,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<Ciclo | null>;
}
