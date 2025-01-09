import { expect, test, describe, beforeAll, afterEach } from "vitest";
import { EmpresaRepository } from "@/app/api/repositories/EmpresaRepository";

describe("EmpresaRepository", () => {
  let empresaRepository: EmpresaRepository;
  beforeAll(() => {
    empresaRepository = new EmpresaRepository();
  });
  afterEach(async () => {
    await empresaRepository.apagarPeloNome("Empresa Teste");
  });
  test("deve retornar uma lista de empresas", async () => {
    const empresas = await empresaRepository.obterTodas();
    expect(empresas).toBeDefined();
  });

  test("deve retornar um empresa", async () => {
    const empresa = await empresaRepository.obterPorId(1);
    expect(empresa).toStrictEqual({ id: 1, name: "Arena" });
  });

  test("deve retornar um empresa", async () => {
    const empresa = await empresaRepository.obterPorNome("Arena");
    expect(empresa).toBeDefined();
  });

  test("deve criar uma empresa", async () => {
    const empresa = await empresaRepository.criar("Empresa Teste");
    expect(empresa).toStrictEqual({
      error: false,
      message: "Empresa criada com sucesso",
    });
  });
});
