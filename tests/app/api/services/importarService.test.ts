import { expect, test, describe, beforeAll } from "vitest";

import { ImportacaoService } from "@/app/api/services/ImportacaoService";
import { ImportarRepository } from "@/app/api/repositories/ImportarRepository";

describe("ImportacaoService", () => {
  let importacaoService: ImportacaoService;
  beforeAll(() => {
    importacaoService = new ImportacaoService(new ImportarRepository());
  });

  test("deve ler informacoes do formulario e error retornar falso por todos os dados foram preenchidos", async () => {
    const formData = new FormData();
    const file = new File(["Testar o teste"], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("date", "2023-01-01");
    formData.append("empresa", "empresa");
    formData.append("site", "site");
    formData.append("user", "user");
    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: false,
      data: {
        file: file,
        weekReference: new Date("2023-01-01T00:00:00.000Z"),
        company: "empresa",
        site: "site",
        user: "user",
      },
    });
  });
  test("deve ler informacoes do formulario e error retornar verdadeiro por está arquivo sem dados", async () => {
    const formData = new FormData();
    const file = new File([""], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("date", "2023-01-01");
    formData.append("empresa", "empresa");
    formData.append("site", "site");
    formData.append("user", "user");
    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: true,
      data: {
        file: file,
        weekReference: new Date("2023-01-01"),
        company: "empresa",
        site: "site",
        user: "user",
      },
    });
  });
  test("deve ler informacoes do formulario e error retornar verdadeiro DATA nao preenchida", async () => {
    const formData = new FormData();
    const file = new File(["O teste vai passar"], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("empresa", "empresa");
    formData.append("site", "site");
    formData.append("user", "user");
    formData.append("weekReference", "");
    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: true,
      data: {
        file: file,
        weekReference: null,
        company: "empresa",
        site: "site",
        user: "user",
      },
    });
  });
  test("deve ler informacoes do formulario e error retornar verdadeiro empresa nao preenchida", async () => {
    const formData = new FormData();
    const file = new File(["O teste vai passar"], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("date", "2023-01-01");
    formData.append("site", "site");
    formData.append("user", "user");
    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: true,
      data: {
        file: file,
        weekReference: new Date("2023-01-01"),
        company: null,
        site: "site",
        user: "user",
      },
    });
  });

  test("deve ler informacoes do formulario e error retornar falso por todos os dados foram preenchidos", async () => {
    const formData = new FormData();
    const file = new File(["Testar o teste"], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("date", "2023-01-01");
    formData.append("empresa", "empresa");
    formData.append("user", "user");
    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: true,
      data: {
        file: file,
        weekReference: new Date("2023-01-01"),
        company: "empresa",
        site: null,
        user: "user",
      },
    });
  });
  test("deve ler informacoes do formulario e error retornar falso por todos os dados foram preenchidos", async () => {
    const formData = new FormData();
    const file = new File(["Testar o teste"], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("file", file);
    formData.append("date", "2023-01-01");
    formData.append("empresa", "empresa");
    formData.append("site", "site");

    const dados = importacaoService.lerInformacoesDoFormulario(formData);
    expect(dados).toStrictEqual({
      error: true,
      data: {
        file: file,
        weekReference: new Date("2023-01-01"),
        company: "empresa",
        site: "site",
        user: null,
      },
    });
  });

  test("deve criar importacao", async () => {
    const importacao = await importacaoService.criarImportacao(
      new Date("2023-01-02"),
      "site",
      "teste",
    );
    expect(importacao).toStrictEqual({
      error: false,
      message: "Importado com sucesso",
    });
  });

  test("deve buscar importacao e retornar o que foi pedido", async () => {
    const importacaoService = new ImportacaoService(new ImportarRepository());
    let importacao: any =
      await importacaoService.buscarPorImportacaoPorDataESite(
        new Date("2023-01-02"),
        "site",
      );
    importacao = {
      error: false,
      importação: {
        createdAt: new Date("2024-09-26T18:23:21.057Z"),
        id: 359,
        modifiedBy: null,
        name: "site",
        referenceDate: new Date("2023-01-02T00:00:00.000Z"),
        relatorio: "site",
        state: "Importado",
        updatedAt: new Date("2024-09-26T18:23:21.057Z"),
      },
      message: "Importado",
    };
    expect(importacao).toStrictEqual({
      error: false,
      importação: {
        createdAt: new Date("2024-09-26T18:23:21.057Z"),
        id: 359,
        modifiedBy: null,
        name: "site",
        referenceDate: new Date("2023-01-02T00:00:00.000Z"),
        relatorio: "site",
        state: "Importado",
        updatedAt: new Date("2024-09-26T18:23:21.057Z"),
      },
      message: "Importado",
    });
  });
  test("deve apagar importacao", async () => {
    const importacaoService = new ImportacaoService(new ImportarRepository());
    const importacao = await importacaoService.apagarImportacaoComDataESite(
      new Date("2023-01-02"),
      "site",
    );
    expect(importacao).toStrictEqual({
      error: false,
      message: "Importação apagada com sucesso",
    });
  });
  test("deve buscar importacao e ela não deve existir", async () => {
    const importacaoService = new ImportacaoService(new ImportarRepository());
    const importacao = await importacaoService.buscarPorImportacaoPorDataESite(
      new Date("2023-01-02"),
      "site",
    );
    expect(importacao).toStrictEqual({
      sucess: false,
      importação: null,
      message: "Importação não encontrada",
    });
  });
});
