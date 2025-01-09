export interface ICronJobCriarCaixaDiarioRepository {
  verificarUltimaExecucao(): Promise<{
    id: number | null;
    date: Date | null;
  } | null>;
  criarCronjob(name: string, date?: Date): Promise<void>;
  encontrarPorNomeEData(
    name: string,
    date: Date,
  ): Promise<{ id: number | null } | null>;
}
