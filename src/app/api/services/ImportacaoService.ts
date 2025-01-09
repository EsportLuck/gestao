import { WorkSheet } from "xlsx";
import { Importacao, Localidade, Prisma, Secao } from "@prisma/client";
import {
  IImportacaoRepository,
  IImportacaoService,
  EstabelecimentoSelecionado,
} from "@/app/api/contracts";
import { createWorkSheet, gravarDadosArenaSite } from "../utils";
import {
  FormatterFunctions,
  formatterMap,
  FormatterStrategy,
  ReportCategory,
  reportSites,
} from "@/app/api/v1/utils/strategy";
import {
  TOlitecCaratecPlanetaCell,
  TReportFratec,
  IFormattedReportSportNet,
  IReportVip,
  TReportAtena,
  TReportBet,
  TFormattedReportArenaSite,
  TFormattedReportBingo,
} from "@/app/api/v1/types";
import {
  gravarDadosJogoDoBicho,
  gravarDadosLoteria,
  gravaDadosFutebol,
} from "../utils";
import { gravarDadosBingo } from "../utils/gravarDadosBingo";
import { prisma } from "@/services/prisma";
import { obterInicioEFimDoCiclo } from "../v1/utils/obterInicioEFimDoCiclo";

export type TFile =
  | TOlitecCaratecPlanetaCell[]
  | TReportFratec[]
  | IFormattedReportSportNet[]
  | IReportVip[]
  | TReportAtena[]
  | TReportBet[]
  | TFormattedReportArenaSite[]
  | TFormattedReportBingo[];

export class ImportacaoService implements IImportacaoService {
  constructor(private importacaoRepository: IImportacaoRepository) {}
  async apagarImportacaoComDataESite(
    dataReferencia: Date,
    site: string,
  ): Promise<{ error: boolean; message: string }> {
    try {
      return await this.importacaoRepository.apagarImportacaoComDataESite(
        dataReferencia,
        site,
      );
    } catch (error) {
      return { error: true, message: "Erro ao apagar importação" };
    }
  }
  async apagarImportacaoComId(
    id: number,
  ): Promise<{ error: boolean; message: string }> {
    try {
      return await this.importacaoRepository.apagarImportacaoComId(id);
    } catch (error) {
      return { error: true, message: "Erro ao apagar importação" };
    }
  }
  async criarImportacao(
    dataReferencia: Date,
    site: string,
    user: string,
  ): Promise<{ error: boolean; message: string }> {
    return await this.importacaoRepository.criarImportacao(
      dataReferencia,
      site,
      user,
    );
  }
  async buscarPorImportacaoPorDataESite(dataReferencia: Date, site: string) {
    const importacao =
      await this.importacaoRepository.buscarPorImportacaoPorDataESite(
        dataReferencia,
        site,
      );

    if (!importacao)
      return {
        importação: null,
        message: "Importação não encontrada",
        sucess: false,
      };

    return {
      importação: importacao,
      message: "Importação encontrada",
      sucess: true,
    };
  }
  lerInformacoesDoFormulario(form: FormData) {
    const { data } = this.importacaoRepository.lerInformacoesDoFormulario(form);
    const validFile = data.file.size > 10;

    if (
      !data.weekReference ||
      !data.company ||
      !data.site ||
      !data.user ||
      !validFile
    )
      return { error: true, data };

    return { error: false, data };
  }

  async criarPlanilhaDeTrabalho(file: File, site: string): Promise<WorkSheet> {
    return await createWorkSheet(file, site);
  }

  async formatarPlanilha(
    file: File,
    site: keyof FormatterFunctions,
  ): Promise<
    | { success: false; message: string; file: undefined }
    | { success: true; message: string; file: TFile }
  > {
    const worksheet = await this.criarPlanilhaDeTrabalho(file, site);
    const formatadores = new FormatterStrategy();
    const {
      message,
      success,
      file: fileFormatter,
    } = await formatadores.execute(site, worksheet);
    if (!success) {
      return { success, message, file: fileFormatter };
    }
    return { success, message, file: fileFormatter };
  }
  async atualizarImportacao(
    id: number,
    data: Partial<Importacao>,
  ): Promise<{ sucess: boolean }> {
    try {
      await this.importacaoRepository.atualizarImportacao(id, data);
      return { sucess: true };
    } catch (error) {
      console.error("atualizarImportacao Service", error);
      return { sucess: false };
    }
  }

  async gravarDadosNoBanco(
    file: TFile,
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    const category = this.getSiteCategory(site);

    if (!category) return { success: false, message: "Site não encontrado" };
    const { success, message } = await category(
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    );

    if (!success) return { success, message };
    return { success, message };
  }
  private async salvarRelatorioJogoDoBichoNoBanco(
    file: TOlitecCaratecPlanetaCell[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    const { success, message } = await gravarDadosJogoDoBicho(
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    );
    if (!success) return { success: false, message };
    return { success, message };
  }

  private async salvarRelatorioLoteriaNoBanco(
    file: TReportFratec[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    const { success, message } = await gravarDadosLoteria(
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    );
    if (!success) return { success: false, message };
    return { success, message };
  }
  private async salvarRelatorioSportNetVipNoBanco(
    file: IFormattedReportSportNet[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    _user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    _localidadesNoBanco: Localidade[] | null,
    _secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    try {
      const { success, message } = await prisma.$transaction(async (tx) => {
        const estabelecimentosDoArquivo = file.map((item) => {
          return {
            nome: item.Estabelecimento,
          };
        });

        const estabelecimentosSemRepetir = Array.from(
          new Set(estabelecimentosDoArquivo),
        );
        const estabelecimentosNaoExistentesNoBancoDeDados =
          estabelecimentosSemRepetir.filter((estabelecimento) => {
            if (
              !!estabelecimentosNoBanco?.find(
                (item) => item.name === estabelecimento.nome,
              ) === false
            ) {
              return true;
            } else {
              return false;
            }
          });

        if (estabelecimentosNaoExistentesNoBancoDeDados.length > 0) {
          for await (const item of estabelecimentosNaoExistentesNoBancoDeDados) {
            await tx.estabelecimento.create({
              data: {
                name: item.nome,
                empresa: {
                  connect: {
                    name: company,
                  },
                },
                site,
              },
            });
          }
        }

        const todosEstabelecimentosNoBancoDeDados =
          await tx.estabelecimento.findMany({
            where: {
              empresa: {
                name: company,
              },
            },
          });

        for await (const dados of file) {
          let estabelecimento = todosEstabelecimentosNoBancoDeDados.find(
            (item) => item.name === dados.Estabelecimento,
          );
          if (!estabelecimento) {
            estabelecimento = await tx.estabelecimento.create({
              data: {
                name: dados.Estabelecimento,
                site,
                empresa: {
                  connect: {
                    name: company,
                  },
                },
              },
            });
          }
          const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(
            new Date(weekReference),
          );
          const resultadoCiclo = await tx.ciclo.findFirst({
            where: {
              reference_date: {
                gte: inicioDoCiclo,
                lt: finalDoCiclo,
              },
              establishment: {
                name: dados.Estabelecimento,
              },
            },
          });
          if (!resultadoCiclo?.id) {
            await tx.ciclo.create({
              data: {
                reference_date: new Date(weekReference),
                establishmentId: estabelecimento.id,
                status: "PENDENTE",
              },
            });
          }

          await tx.vendas.create({
            data: {
              quantity: dados.Quantidade,
              value: dados.Vendas,
              site,
              importacaoId,
              referenceDate: new Date(weekReference),
              establishmentId: estabelecimento.id,
            },
          });
          await tx.comissao.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dados.Comissão,
            },
          });
          await tx.premios.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dados["Prêmios/Saques"],
            },
          });
          await tx.liquido.create({
            data: {
              referenceDate: new Date(weekReference),
              site,
              importacaoId,
              establishmentId: estabelecimento.id,
              value: dados.Líquido,
            },
          });
          const caixa = await tx.caixa.findFirst({
            where: {
              referenceDate: new Date(weekReference),
              establishmentId: estabelecimento.id,
            },
          });

          if (!caixa?.id) {
            await tx.caixa.create({
              data: {
                referenceDate: new Date(weekReference),
                importacaoId,
                establishmentId: estabelecimento.id,
                total: dados.Líquido,
                status: "PENDENTE",
              },
            });
          } else {
            await tx.caixa.update({
              where: {
                id: caixa.id,
              },
              data: {
                total: {
                  increment: dados.Líquido,
                },
              },
            });
          }
        }

        return { success: true, message: "Importado com sucesso" };
      });
      if (success) {
        return { success, message: "Importado com sucesso" };
      }
      return { success, message };
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof SyntaxError ||
        error instanceof TypeError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        console.error(" Erro no servidor importação Arena Site ", error);
        return { success: false, message: "Erro interno do servidor" };
      }
    }
  }
  private async salvarRelatorioSportBetNoBanco(
    file: IFormattedReportSportNet[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    _user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    _localidadesNoBanco: Localidade[] | null,
    _secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    try {
      const {
        success,
        message,
      }: { success: true; message: "Importado com sucesso" } =
        await prisma.$transaction(async (tx) => {
          const estabelecimentosQueNaoExisteNoBancoDeDados = file?.filter(
            (estabelecimento) =>
              estabelecimentosNoBanco?.find(
                (estabelecimentoNoBanco) =>
                  estabelecimentoNoBanco.name?.trim().toLowerCase() ===
                  estabelecimento.Estabelecimento.trim().toLowerCase(),
              ) === undefined,
          );
          if (estabelecimentosQueNaoExisteNoBancoDeDados.length > 0) {
            for await (const dado of estabelecimentosQueNaoExisteNoBancoDeDados) {
              await tx.estabelecimento.create({
                data: {
                  name: dado.Estabelecimento,
                  site,
                  empresa: {
                    connect: {
                      name: company,
                    },
                  },
                },
              });
            }
          }
          const todosEstabelecimentosNoBanco =
            await tx.estabelecimento.findMany({
              where: {
                empresa: {
                  name: company,
                },
              },
            });

          for await (const relatorio of file) {
            let estabelecimentoNoBanco = todosEstabelecimentosNoBanco.find(
              (dado) => dado.name === relatorio.Estabelecimento,
            );
            if (!estabelecimentoNoBanco?.id) {
              estabelecimentoNoBanco = await tx.estabelecimento.create({
                data: {
                  name: relatorio.Estabelecimento,
                  empresa: {
                    connect: {
                      name: company,
                    },
                  },
                  site,
                },
              });
            }
            const { inicioDoCiclo, finalDoCiclo } =
              obterInicioEFimDoCiclo(weekReference);
            const ciclo = await tx.ciclo.findFirst({
              where: {
                establishmentId: estabelecimentoNoBanco.id,
                reference_date: {
                  gte: inicioDoCiclo,
                  lte: finalDoCiclo,
                },
              },
            });

            if (!ciclo?.id) {
              await tx.ciclo.create({
                data: {
                  reference_date: new Date(weekReference),
                  status: "PENDENTE",
                  establishmentId: estabelecimentoNoBanco.id,
                },
              });
            }

            await tx.vendas.create({
              data: {
                establishmentId: estabelecimentoNoBanco.id,
                referenceDate: new Date(weekReference),
                quantity: relatorio.Quantidade,
                value: relatorio.Vendas,
                importacaoId,
                site,
              },
            });

            await tx.comissao.create({
              data: {
                establishmentId: estabelecimentoNoBanco.id,
                referenceDate: new Date(weekReference),
                value: relatorio.Comissão,
                importacaoId,
                site,
              },
            });

            await tx.premios.create({
              data: {
                referenceDate: new Date(weekReference),
                establishmentId: estabelecimentoNoBanco.id,
                value: relatorio["Prêmios/Saques"],
                site,
                importacaoId,
              },
            });

            await tx.liquido.create({
              data: {
                referenceDate: new Date(weekReference),
                establishmentId: estabelecimentoNoBanco.id,
                value: relatorio.Líquido,
                importacaoId,
                site,
              },
            });

            const caixa = await tx.caixa.findFirst({
              where: {
                referenceDate: new Date(weekReference),
                establishmentId: estabelecimentoNoBanco.id,
              },
            });

            if (!caixa?.id) {
              await tx.caixa.create({
                data: {
                  referenceDate: new Date(weekReference),
                  establishmentId: estabelecimentoNoBanco.id,
                  total: relatorio.Líquido,
                  importacaoId,
                  status: "PENDENTE",
                  value_futebol: relatorio.Líquido,
                  futebol: site,
                },
              });
            } else {
              await tx.caixa.update({
                where: {
                  id: caixa.id,
                },
                data: {
                  total: {
                    increment: relatorio.Líquido,
                  },
                  value_futebol: {
                    increment: relatorio.Líquido,
                  },
                },
              });
            }
          }

          return { success: true, message: "Importado com sucesso" };
        });
      return { success, message };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Error ||
        error instanceof TypeError ||
        error instanceof SyntaxError
      ) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Erro desconhecido" };
      }
    }
  }
  private async salvarRelatorioAtenaNoBanco(
    file: TReportAtena[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    _user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    const { success, message } = await gravaDadosFutebol(
      file,
      site,
      weekReference,
      company,
      estabelecimentosNoBanco || [],
      localidadesNoBanco || [],
      secaoNoBanco || [],
      importacaoId,
    );
    if (!success) return { success, message };
    return { success, message: "Importado com sucesso" };
  }

  private async salvarRelatorioArenaSiteNoBanco(
    file: TFormattedReportArenaSite[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    const { success, message } = await gravarDadosArenaSite(
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    );
    if (!success) return { success, message };
    return { success, message: "Importado com sucesso" };
  }

  private async salvarReportBingoNoBanco(
    file: TFormattedReportBingo[],
    site: keyof FormatterFunctions,
    weekReference: Date,
    company: string,
    user: string,
    estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
    localidadesNoBanco: Localidade[] | null,
    secaoNoBanco: Secao[] | null,
    importacaoId: number,
  ): Promise<
    | { success: true; message: "Importado com sucesso" }
    | { success: false; message: string }
  > {
    try {
      const { success, message } = await gravarDadosBingo(
        file,
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      );
      if (!success) {
        return { success, message };
      }
      return { success, message };
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof SyntaxError ||
        error instanceof TypeError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        console.error(" Erro no servidor importação Arena Site ", error);
        return { success: false, message: "Erro interno do servidor" };
      }
    }
  }

  private getSiteCategory(site: Extract<keyof typeof formatterMap, string>) {
    for (const [category, sites] of Object.entries(reportSites)) {
      if (sites.includes(site)) {
        return this.categoryFunctions[category as ReportCategory];
      }
    }
    return null;
  }
  private categoryFunctions: Record<
    ReportCategory,
    (
      file: TFile,
      site: keyof FormatterFunctions,
      weekReference: Date,
      company: string,
      user: string,
      estabelecimentosNoBanco: EstabelecimentoSelecionado[] | null,
      localidadesNoBanco: Localidade[] | null,
      secaoNoBanco: Secao[] | null,
      importacaoId: number,
    ) => Promise<
      | { success: true; message: "Importado com sucesso" }
      | { success: false; message: string }
    >
  > = {
    [ReportCategory.VIP]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) =>
      await this.salvarRelatorioSportNetVipNoBanco(
        file as IFormattedReportSportNet[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      ),
    [ReportCategory.BET]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) =>
      await this.salvarRelatorioSportBetNoBanco(
        file as IFormattedReportSportNet[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      ),
    [ReportCategory.ARENA]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) =>
      await this.salvarRelatorioAtenaNoBanco(
        file as TReportAtena[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      ),
    [ReportCategory.JOGO_DO_BICHO]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) =>
      await this.salvarRelatorioJogoDoBichoNoBanco(
        file as TOlitecCaratecPlanetaCell[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      ),
    [ReportCategory.LOTERIA]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) =>
      await this.salvarRelatorioLoteriaNoBanco(
        file as TReportFratec[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      ),
    [ReportCategory.ARENA_SITE]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) => {
      return await this.salvarRelatorioArenaSiteNoBanco(
        file as TFormattedReportArenaSite[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      );
    },
    [ReportCategory.BINGO]: async (
      file,
      site,
      weekReference,
      company,
      user,
      estabelecimentosNoBanco,
      localidadesNoBanco,
      secaoNoBanco,
      importacaoId,
    ) => {
      return await this.salvarReportBingoNoBanco(
        file as TFormattedReportBingo[],
        site,
        weekReference,
        company,
        user,
        estabelecimentosNoBanco,
        localidadesNoBanco,
        secaoNoBanco,
        importacaoId,
      );
    },
  };
}
