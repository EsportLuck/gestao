import { prisma } from "@/services/prisma";
import { registerReportFutebol } from "@/app/api/v1/utils/create";
import { Localidade, Secao } from "@prisma/client";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";
import { TReportAtena } from "@/app/api/v1/types";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";

export const gravaDadosFutebol = async (
  file: TReportAtena[],
  site: keyof FormatterFunctions,
  weekReference: Date,
  company: string,
  estabelecimentosNoBanco: EstabelecimentoSelecionado[],
  localidadesNoBanco: Localidade[],
  secaoNoBanco: Secao[],
  importacaoId: number,
) => {
  const localidadesDoArquivo = file.map((dadosDosEstabelecimentos) => {
    return {
      name: dadosDosEstabelecimentos.Localidade,
      empresa: {
        connect: {
          name: company,
        },
      },
    };
  });
  const secaoDoArquivo = file.map((dadosDosEstabelecimentos) => {
    return {
      name: dadosDosEstabelecimentos.Seção,
      localidade: {
        connect: {
          name: dadosDosEstabelecimentos.Localidade,
        },
      },
      empresa: {
        connect: {
          name: company,
        },
      },
    };
  });

  const estabelecimentosDoArquivo = file.map((dadosDosEstabelecimentos) => {
    return {
      name: dadosDosEstabelecimentos.Estabelecimento,
      site,
      empresa: {
        connect: {
          name: company,
        },
      },
      localidade: {
        connect: {
          name: dadosDosEstabelecimentos.Localidade,
        },
      },
      secao: {
        connect: {
          name: dadosDosEstabelecimentos.Seção,
        },
      },
    };
  });

  const dadosNoSistema = await prisma.$transaction(
    async () => {
      const { localidadesSuccess } = await criarLocalidadesInexistentes(
        localidadesNoBanco,
        localidadesDoArquivo,
      );
      const { secaoSuccess } = await criarSecaoInexistentes(
        secaoNoBanco || [],
        secaoDoArquivo,
        localidadesSuccess,
      );

      const { estabelecimentosSuccess } =
        await criarEstabelecimentosInexistentes(
          estabelecimentosNoBanco,
          estabelecimentosDoArquivo,
          localidadesSuccess,
          secaoSuccess,
        );

      if (estabelecimentosSuccess) {
        const estabelecimentos = await prisma.estabelecimento.findMany({
          where: {
            empresa: {
              name: company,
            },
          },
          select: {
            id: true,
            name: true,
            matrizId: true,
          },
        });

        for (const dadosEstabelecimento of file) {
          const estabelecimento = estabelecimentos.find(
            (estab) => estab.name === dadosEstabelecimento.Estabelecimento,
          );

          await registerReportFutebol(
            estabelecimento?.id as number,
            weekReference,
            site,
            dadosEstabelecimento.Vendas,
            dadosEstabelecimento.Quantidade,
            dadosEstabelecimento.Comissão,
            dadosEstabelecimento["Prêmios/Saques"],
            dadosEstabelecimento.Líquido,
            importacaoId,
            estabelecimento?.matrizId as number,
          );
        }

        return { success: true, message: "Importado com sucesso" };
      }
    },
    { timeout: 10000 },
  );

  if (dadosNoSistema?.success)
    return { success: dadosNoSistema.success, message: dadosNoSistema.message };

  return { success: false, message: "Não foi possível importar os dados" };
};

const criarLocalidadesInexistentes = async (
  localidadesNoBanco: Localidade[] | [],
  localidadesNoArquivo: {
    name: string;
    empresa: {
      connect: {
        name: string;
      };
    };
  }[],
) => {
  try {
    const localidadesSemRepetir = localidadesNoArquivo.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );

    const localidadesParaCriar = localidadesSemRepetir.filter(
      (item) =>
        !localidadesNoBanco.find((localidade) => localidade.name === item.name),
    );

    for (const item of localidadesParaCriar) {
      await prisma.localidade.create({
        data: {
          name: item.name,
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
        },
      });
    }
    return { localidadesSuccess: true };
  } catch (error) {
    console.error(error);
    return { localidadesSuccess: false };
  }
};

const criarSecaoInexistentes = async (
  secaoNoBanco: Secao[],
  secaoNoArquivo: {
    name: string;
    localidade: {
      connect: {
        name: string;
      };
    };
    empresa: {
      connect: {
        name: string;
      };
    };
  }[],
  localidadesSuccess: boolean,
) => {
  try {
    if (!localidadesSuccess) return { secaoSuccess: false };

    const secaoSemRepetir = secaoNoArquivo.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );
    const secaoParaCriar = secaoSemRepetir.filter((item) => {
      return !secaoNoBanco.find((secao) => secao.name === item.name);
    });

    for (const item of secaoParaCriar) {
      await prisma.secao.create({
        data: {
          name: item.name,
          Localidade: {
            connect: {
              name: item.localidade.connect.name,
            },
          },
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
        },
      });
    }

    return { secaoSuccess: true };
  } catch (error) {
    console.error(error);
    return { secaoSuccess: false };
  }
};

const criarEstabelecimentosInexistentes = async (
  estabelecimentosNoBanco: EstabelecimentoSelecionado[],
  estabelecimentosNoArquivo: {
    name: string;
    site: string;
    empresa: {
      connect: {
        name: string;
      };
    };
    localidade: {
      connect: {
        name: string;
      };
    };
    secao: {
      connect: {
        name: string;
      };
    };
  }[],
  localidadesSuccess: boolean,
  secaoSuccess: boolean,
) => {
  try {
    if (!localidadesSuccess || !secaoSuccess)
      return { estabelecimentosSuccess: false };

    const estabelecimentosParaCriar = estabelecimentosNoArquivo.filter(
      (item) =>
        !estabelecimentosNoBanco.find(
          (estabelecimento) => estabelecimento.name === item.name.trim(),
        ),
    );

    for (const item of estabelecimentosParaCriar) {
      await prisma.estabelecimento.create({
        data: {
          name: item.name.trim(),
          site: item.site,
          empresa: {
            connect: {
              name: item.empresa.connect.name,
            },
          },
          companies: {
            connect: {
              id: 1,
            },
          },
          localidade: {
            connect: {
              name: item.localidade.connect.name,
            },
          },
          secao: {
            connect: {
              name: item.secao.connect.name,
            },
          },
        },
      });
    }
    return { estabelecimentosSuccess: true };
  } catch (error) {
    console.error(error);
    return { estabelecimentosSuccess: false };
  }
};
