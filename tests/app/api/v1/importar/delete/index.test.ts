import { expect, it, describe, beforeAll, vi, afterAll } from "vitest";
import fs from "node:fs";
import axios from "axios";
import { EstabelecimentoService, ImportacaoService } from "@/app/api/services";
import {
  EstabelecimentoRepository,
  ImportarRepository,
} from "@/app/api/repositories";
import { EstabelecimentosExtrato } from "@/components/template/estabelecimentos-report-table/columns";
import { prisma } from "@/services/prisma";
async function deleteAll() {
  // Deletar registros de todos os modelos. Certifique-se de listar todos os seus modelos aqui.
  await prisma.login.deleteMany();
  await prisma.observacao.deleteMany();
  await prisma.lancamentos.deleteMany();
  await prisma.vendas.deleteMany();
  await prisma.premios.deleteMany();
  await prisma.liquido.deleteMany();
  await prisma.caixa.deleteMany();
  await prisma.despesas.deleteMany();
  await prisma.despesasFixas.deleteMany();
  await prisma.comissao.deleteMany();
  await prisma.sangria.deleteMany();
  await prisma.deposito.deleteMany();
  await prisma.localidade.deleteMany();
  await prisma.secao.deleteMany();
  await prisma.rota.deleteMany();
  await prisma.importacao.deleteMany();
  await prisma.ciclo.deleteMany();
  await prisma.estabelecimento.deleteMany();
}
function delayedGet(url: string, delay: number) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const response = await axios.get(url);
      resolve(response);
    }, delay);
  });
}

describe("Delete Importacao", () => {
  afterAll(async () => {
    await deleteAll();
  });
  const estabelecimentoService = new EstabelecimentoService(
    new EstabelecimentoRepository(),
  );
  const urlBaseImportar = "http://localhost:3000/api/v1/import";
  const urlBaseApagarImportacao = "http://localhost:3000/api/v1/import/delete";
  const urlBaseConectarComFilias =
    "http://localhost:3000/api/v1/management/establishments/update/to-filial";
  const futebol2300Dia21 = fs.readFileSync(
    "./tests/utils/importacao/2300-dia-21-10.xlsx",
  );
  const futebol2300Dia22 = fs.readFileSync(
    "./tests/utils/importacao/2300-dia-22-10.xlsx",
  );
  const bichoDia21 = fs.readFileSync(
    "./tests/utils/importacao/olitec-dia-21-10.xls",
  );
  const bichoDia22 = fs.readFileSync(
    "./tests/utils/importacao/olitec-dia-22-10.xls",
  );

  const loteriaDia22 = fs.readFileSync(
    "./tests/utils/importacao/FRATEC-dia-22-10.xls",
  );
  const diaDaImportacao = "2024-11-18T00:00:00.000Z";
  it(`deve importar o relatorio do dia ${diaDaImportacao} futebol e retornar 200`, async () => {
    const formData = new FormData();
    const file = new File([futebol2300Dia21], "futebol21.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("file", file);
    formData.append("date", diaDaImportacao);
    formData.append("empresa", "Arena");
    formData.append("site", "2300 - arena sport luck");
    formData.append("user", "user");

    const response = await axios.post(urlBaseImportar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    expect(response.data).toStrictEqual({
      status: 200,
      message: "Importado com sucesso",
    });
  });

  it(`deve importar o relatorio do dia ${diaDaImportacao} JB e retornar 200`, async () => {
    const formData = new FormData();
    const file = new File([bichoDia21], "JB21.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("file", file);
    formData.append("date", diaDaImportacao);
    formData.append("empresa", "Arena");
    formData.append("site", "olitec");
    formData.append("user", "user");
    const response = await axios.post(urlBaseImportar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    expect(response.data).toStrictEqual({
      status: 200,
      message: "Importado com sucesso",
    });
  });

  it("Extrato liquido deve retorna o valor total de 83.47", async () => {
    const site = "Arena";
    const user = "user-test";
    const role = "role-test";
    const inicioDoCiclo = new Date(diaDaImportacao);
    const finalDoCiclo = new Date("2024-11-21T00:00:00.000Z");
    const url = `http://localhost:3000/api/v1/extract?dataInicial=${inicioDoCiclo.toString()}&dataFinal=${finalDoCiclo.toISOString()}&localidade=${"undefined"}&secao=${"undefined"}&rota=${"undefined"}&supervisor=${"undefined"}&estabelecimento=${"undefined"}&role=${role}&username=${user}&site=${site}`;
    const delay = 1;
    const relatorio: any = await delayedGet(url, delay);
    const liquido: string = relatorio.data.extrato.reduce(
      (total: number, item: EstabelecimentosExtrato) => total + item.líquido,
      0,
    );

    expect(liquido).toBe(83.47);
  });

  it("Deve conectar filial a matriz de empresas Se não tiver conectado e caso não tenha filiais", async () => {
    const estabelecimentoMatriz = await estabelecimentoService.encontrarPorNome(
      "010547 - LOJA ARENA 1 COROATA",
    );
    const estabelecimentoFilial = await estabelecimentoService.encontrarPorNome(
      "010980 - LOJA ARENA 1 COROATA",
    );

    const response = await axios.post(urlBaseConectarComFilias, {
      id: estabelecimentoMatriz?.id,
      filiais: {
        connect: {
          id: estabelecimentoFilial?.id,
        },
      },
    });
    expect(response.data).toStrictEqual({
      message: "Establishment updated to filial successfully",
    });
  });

  it("Deve buscar o estabelecimento depois de conectar a filial e mostrar valores corretos 010547 - LOJA ARENA 1 COROATA", async () => {
    const caixa = await prisma.estabelecimento.findUnique({
      where: {
        name: "010547 - LOJA ARENA 1 COROATA",
      },
      select: {
        caixa: {
          where: {
            referenceDate: {
              equals: new Date(diaDaImportacao),
            },
          },
          select: {
            total: true,
            value_bicho: true,
            value_futebol: true,
            value_loteria: true,
          },
        },
      },
    });
    expect(caixa?.caixa[0].total).toBe(8347);
    expect(caixa?.caixa[0].value_bicho).toBe(1040);
    expect(caixa?.caixa[0].value_futebol).toBe(7307);
  });

  // it("deve apagar a importacao", async () => {
  //   const importacaoService = new ImportacaoService(new ImportarRepository());
  //   const importacao = await importacaoService.buscarPorImportacaoPorDataESite(
  //     new Date("2024-10-21T00:00:00.000Z"),
  //     "2300 - arena sport luck",
  //   );

  //   const response = await axios.delete(urlBaseApagarImportacao, {
  //     data: {
  //       idImportacao: importacao.importação?.id,
  //       weekReference: "2024-10-21T00:00:00.000Z",
  //       site: "2300 - arena sport luck",
  //     },
  //   });
  //   expect(response.data).toStrictEqual({
  //     status: 200,
  //     message: "Apagado com sucesso",
  //   });
  //   const caixas = await prisma.caixa.findMany({
  //     where: {
  //       referenceDate: {
  //         equals: new Date("2024-10-21T00:00:00.000Z"),
  //       },
  //     },
  //   });
  //   const equal = caixas[0]?.total === caixas[1]?.total;

  //   expect(equal).toBe(true);
  // });

  // it("Deve buscar o estabelecimento depois de importacao ser deletada e mostrar valores corretos 010547 - LOJA ARENA 1 COROATA", async () => {
  //   const caixa = await prisma.estabelecimento.findUnique({
  //     where: {
  //       name: "010547 - LOJA ARENA 1 COROATA",
  //     },
  //     select: {
  //       caixa: {
  //         where: {
  //           referenceDate: {
  //             equals: new Date("2024-10-21T00:00:00.000Z"),
  //           },
  //         },
  //         select: {
  //           total: true,
  //           value_bicho: true,
  //           value_futebol: true,
  //           value_loteria: true,
  //         },
  //       },
  //     },
  //   });

  //   expect(caixa?.caixa[0].total).toBe(1040);
  // });
});
