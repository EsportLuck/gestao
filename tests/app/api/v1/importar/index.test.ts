import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { expect, it, describe, beforeAll, vi } from "vitest";
import fs from "node:fs";
import axios from "axios";
import { ImportacaoService } from "@/app/api/services/ImportacaoService";
import { ImportarRepository } from "@/app/api/repositories/ImportarRepository";

describe("Importar", () => {
  let fetch: FetchHttpClient;
  const urlBaseImportar = "http://localhost:3000/api/v1/import";
  const urlBaseApagarImportacao = "http://localhost:3000/api/v1/import/delete";
  const bufferDoArquivo = fs.readFileSync("./tests/utils/arena.xlsx");
  beforeAll(() => {
    fetch = new FetchHttpClient();
  });
  it("deve retornar 200", async () => {
    const formData = new FormData();
    const file = new File([bufferDoArquivo], "file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("file", file);
    formData.append("date", "2023-02-01");
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
  it("deve retornar 200 e apagar importacao", async () => {
    const importacao = new ImportacaoService(new ImportarRepository());
    const { importação } = await importacao.buscarPorImportacaoPorDataESite(
      new Date("2023-02-01"),
      "2300 - arena sport luck",
    );
    const data = {
      weekReference: "2023-02-01",
      site: "2300 - arena sport luck",
      idImportacao: importação?.id,
    };

    const response = await axios.delete(urlBaseApagarImportacao, {
      data,
    });
    expect(response.data).toStrictEqual({
      status: 200,
      message: "Apagado com sucesso",
    });
  });
});
