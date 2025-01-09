import { prisma } from "@/services/prisma";
import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";

export interface IEstablishment {
  id: number;
  referenceDate?: string;
  localidade?: string;
  name?: string;
  rota?: string;
  secao?: string;
  status?: string;
  site?: string;
  supervisor?: string;
  comissao_retida?: string;
}

type IUpdate = Omit<IEstablishment, "id">;

function verificaValor(num: number | null | undefined) {
  if (num === null || num === undefined) return 0;
  return num;
}

export class Establishment {
  constructor(private data: IEstablishment) {
    this.data = data;
  }

  async findUnique() {
    const { id } = this.data;
    try {
      if (!id) throw new Error("Id não preenchido");
      return await prisma.estabelecimento.findUnique({ where: { id } });
    } catch (err) {
      throw new Error("Algo deu errado ao localizar estabelecimento");
    } finally {
      await prisma.$disconnect();
    }
  }

  async findMany() {
    return await prisma.estabelecimento.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findFirst(name: string) {
    try {
      if (!name) throw new Error("Name não preenchido");
      return await prisma.estabelecimento.findFirst({ where: { name } });
    } catch (err) {
      throw new Error("Algo deu errado ao localizar estabelecimento");
    } finally {
      await prisma.$disconnect();
    }
  }

  async findUniqueWeeklyCharge() {
    const { id, referenceDate } = this.data;
    try {
      if (!id || !referenceDate) throw new Error("Algum dando faltando");

      const gte = new Date(referenceDate).setUTCHours(0, 0, 0, 0);
      const lte = new Date(referenceDate).setUTCHours(23, 59, 59, 999);

      const caixa = await prisma.estabelecimento.findMany({
        where: {
          id,
        },
        select: {
          caixa: {
            where: {
              referenceDate: {
                gte: new Date(gte),
                lte: new Date(lte),
              },
            },
          },
        },
      });
      return caixa[0].caixa.map((item) => {
        return {
          id: item.id,
          value: item.total,
        };
      });
    } catch (err) {
      throw new Error(
        "Algo deu errado ao localizar estabelecimento findUniqueWeeklyCharge",
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  buildUpdateData(fields: IUpdate) {
    return Object.fromEntries(
      Object.entries(fields).filter(
        ([key, value]) => key !== "id" && value !== undefined,
      ),
    );
  }

  async update() {
    const { id } = this.data;
    try {
      const updateData: any = this.buildUpdateData(this.data);
      await prisma.estabelecimento.update({
        where: { id },
        data: updateData,
      });
      return true;
    } catch (error) {
      console.error("establi shment update", error);
      throw new Error("Algo deu errado ao atualizar estabelecimento");
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateToFilial() {
    const { id } = this.data;
    await prisma.$transaction(async (tx) => {
      try {
        const updateData: any = this.buildUpdateData(this.data);

        const [caixaMatrix, caixaFilial] = await Promise.all([
          await tx.caixa.findMany({
            where: {
              establishmentId: id,
            },
            select: {
              id: true,
              total: true,
              value_bicho: true,
              value_futebol: true,
              value_loteria: true,
              importacaoId: true,
              referenceDate: true,
            },
          }),
          await tx.caixa.findMany({
            where: {
              establishmentId: updateData.filiais.connect.id,
            },
            select: {
              id: true,
              total: true,
              value_bicho: true,
              value_futebol: true,
              value_loteria: true,
              referenceDate: true,
              importacaoId: true,
            },
          }),
          await tx.companies.update({
            where: {
              id: 1,
            },
            data: {
              parent_companies: {
                disconnect: {
                  id: updateData.filiais.connect.id,
                },
              },
            },
          }),
          await tx.estabelecimento.update({
            where: { id },
            data: {
              filiais: {
                connect: {
                  id: updateData.filiais.connect.id,
                },
              },
            },
          }),
        ]);

        if (
          caixaMatrix.length > caixaFilial.length ||
          caixaMatrix.length === caixaFilial.length
        ) {
          for await (const caixa of caixaMatrix) {
            const caixaDaFilial = caixaFilial.filter((item) => {
              const filialDate = new Date(item.referenceDate).toDateString();
              const matrixDate = new Date(caixa.referenceDate).toDateString();

              return filialDate === matrixDate;
            });
            if (caixaDaFilial.length === 0) continue;

            const total =
              verificaValor(caixa.total) +
              verificaValor(caixaDaFilial[0]?.total);
            const value_bicho =
              verificaValor(caixa.value_bicho) +
              verificaValor(caixaDaFilial[0]?.value_bicho);
            const value_futebol =
              verificaValor(caixa.value_futebol) +
              verificaValor(caixaDaFilial[0]?.value_futebol);
            const value_loteria =
              verificaValor(caixa.value_loteria) +
              verificaValor(caixaDaFilial[0]?.value_loteria);
            await tx.caixa.update({
              where: {
                id: caixa.id,
              },
              data: {
                total,
                value_bicho,
                value_futebol,
                value_loteria,
              },
            });
          }
        } else {
          for await (const caixa of caixaFilial) {
            const caixaDaMatrix = caixaMatrix.filter((item) => {
              const matrixDate = new Date(item.referenceDate).toDateString();
              const filialDate = new Date(caixa.referenceDate).toDateString();
              return filialDate === matrixDate;
            });
            if (caixaDaMatrix.length === 0) {
              const ciclosFilial = await tx.ciclo.findMany({
                where: {
                  establishmentId: updateData.filiais.connect.id,
                },
              });
              for await (const ciclo of ciclosFilial) {
                await tx.ciclo.create({
                  data: {
                    reference_date: new Date(ciclo.reference_date),
                    status: "PENDENTE",
                    establishmentId: id,
                  },
                });
              }
              return await tx.caixa.create({
                data: {
                  referenceDate: new Date(caixa.referenceDate),
                  total: caixa.total,
                  value_bicho: caixa.value_bicho,
                  value_futebol: caixa.value_futebol,
                  value_loteria: caixa.value_loteria,
                  status: "PENDENTE",
                  importacaoId: caixa.importacaoId,
                  establishmentId: id,
                },
              });
            }

            const total =
              verificaValor(caixa.total) +
              verificaValor(caixaDaMatrix[0]?.total);
            const value_bicho =
              verificaValor(caixa.value_bicho) +
              verificaValor(caixaDaMatrix[0]?.value_bicho);
            const value_futebol =
              verificaValor(caixa.value_futebol) +
              verificaValor(caixaDaMatrix[0]?.value_futebol);
            const value_loteria =
              verificaValor(caixa.value_loteria) +
              verificaValor(caixaDaMatrix[0]?.value_loteria);
            await prisma.caixa.update({
              where: {
                id: caixa.id,
              },
              data: {
                total,
                value_bicho,
                value_futebol,
                value_loteria,
              },
            });
          }
        }
      } catch (err) {
        console.error("Update to filial establishment", err);
      }
    });
  }
}
