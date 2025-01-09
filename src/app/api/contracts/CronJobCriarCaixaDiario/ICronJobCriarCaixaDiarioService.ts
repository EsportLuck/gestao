export interface ICronJobCriarCaixaDiarioService {
  executarCronjobCaixa(): Promise<
    | {
        success: true;
        message: "Caixas Criados com sucesso" | "Primeira execução";
      }
    | { success: false; message: "Caixa já criados" }
  >;
}
