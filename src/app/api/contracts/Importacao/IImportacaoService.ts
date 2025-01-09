import { Importacao, Localidade, Secao } from "@prisma/client";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { TFile } from "@/app/api/services";
import {
  EstabelecimentoSelecionado,
  dadosDoFormulario,
} from "@/app/api/contracts";

export interface IImportacaoService {
  lerInformacoesDoFormulario(form: FormData): {
    error: boolean;
    data: dadosDoFormulario;
  };
  buscarPorImportacaoPorDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<{
    importação: Partial<Importacao> | null;
    message: string;
    sucess: boolean;
  }>;
  criarImportacao(
    dataReferencia: Date,
    site: string,
    user: string,
  ): Promise<{ error: boolean; message: string }>;
  apagarImportacaoComDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<{ error: boolean; message: string }>;
  apagarImportacaoComId(
    id: number,
  ): Promise<{ error: boolean; message: string }>;
  atualizarImportacao(
    id: number,
    data: Partial<Importacao>,
  ): Promise<{ sucess: boolean }>;
  formatarPlanilha(
    file: File,
    site: keyof FormatterFunctions,
    options?: any,
  ): Promise<
    | { success: false; message: string; file: undefined }
    | { success: true; message: string; file: TFile }
  >;

  gravarDadosNoBanco(
    file: TFile,
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<{ success: boolean; message: string }>;
}
