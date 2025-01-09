import { expect, test, describe, beforeAll } from "vitest";

import { ImportarRepository } from "@/app/api/repositories/ImportarRepository";

describe("ImportacaoRepository", () => {
  let importacaoRepository: ImportarRepository;
  beforeAll(() => {
    importacaoRepository = new ImportarRepository();
  });

  test("deve criar importacao", async () => {
    const importacao = await importacaoRepository.criarImportacao(
      new Date("2023-01-01"),
      "site",
      "teste",
    );
    expect(importacao).toStrictEqual({
      error: false,
      message: "Importado com sucesso",
    });
  });

  test("deve buscar importacao", async () => {
    let importacao: any =
      await importacaoRepository.buscarPorImportacaoPorDataESite(
        new Date("2023-01-01"),
        "site",
      );
    importacao = {
      error: false,
      importação: {
        createdAt: new Date("2024-09-26T18:28:38.648Z"),
        id: 364,
        modifiedBy: null,
        name: "site",
        referenceDate: new Date("2023-01-01T00:00:00.000Z"),
        relatorio: "site",
        state: "Importado",
        updatedAt: new Date("2024-09-26T18:28:38.648Z"),
      },
      message: "Importado",
    };
    expect(importacao).toStrictEqual({
      error: false,
      importação: {
        createdAt: new Date("2024-09-26T18:28:38.648Z"),
        id: 364,
        modifiedBy: null,
        name: "site",
        referenceDate: new Date("2023-01-01T00:00:00.000Z"),
        relatorio: "site",
        state: "Importado",
        updatedAt: new Date("2024-09-26T18:28:38.648Z"),
      },
      message: "Importado",
    });
  });

  test("deve apagar importacao", async () => {
    const importacao = await importacaoRepository.apagarImportacaoComDataESite(
      new Date("2023-01-01"),
      "site",
    );
    expect(importacao).toStrictEqual({
      error: false,
      message: "Importação apagada com sucesso",
    });
  });

  test("deve buscar importacao e ela não deve existir", async () => {
    const importacao =
      await importacaoRepository.buscarPorImportacaoPorDataESite(
        new Date("2023-01-01"),
        "site",
      );
    expect(importacao).toStrictEqual(null);
  });
});
