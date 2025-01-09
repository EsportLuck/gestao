import { prisma } from "@/services/prisma";

export const createRegisterEstabelecimento = async (
  estabelecimento: string,
  site: string,
  empresa: string,
  localidade?: number,
  secao?: number,
) => {
  if (!estabelecimento || !site || !empresa)
    throw new Error("Some data is missing in createRegisterEstabelecimento");

  if (localidade && secao) {
    try {
      await prisma.estabelecimento.create({
        data: {
          name: estabelecimento.trim(),
          status_atividade: "Ativo",
          empresa: {
            connect: {
              name: empresa,
            },
          },
          site,
          companies: {
            connect: {
              id: 1,
            },
          },
          localidade: {
            connect: {
              id: localidade,
            },
          },
          secao: {
            connect: {
              id: secao,
            },
          },
        },
      });
      return;
    } catch (error) {
      console.error("create createRegisterEstabelecimento", error);
    }
  }
  if (localidade) {
    try {
      await prisma.estabelecimento.create({
        data: {
          name: estabelecimento.trim(),
          status_atividade: "Ativo",
          empresa: {
            connect: {
              name: empresa,
            },
          },
          site,
          companies: {
            connect: {
              id: 1,
            },
          },
          localidade: {
            connect: {
              id: localidade,
            },
          },
        },
      });
      return;
    } catch (error) {
      console.error("create createRegisterEsbelecimento", error);
    }
  }
  try {
    await prisma.estabelecimento.create({
      data: {
        name: estabelecimento.trim(),
        status_atividade: "Ativo",
        empresa: {
          connect: {
            name: empresa,
          },
        },
        site,
        companies: {
          connect: {
            id: 1,
          },
        },
      },
    });
  } catch (error) {
    console.error("create createRegisterEstabelecimento", error);
  }
};
