import { EmpresaService } from "@/app/api/services/EmpresaService";
import { EmpresaRepository } from "@/app/api/repositories/EmpresaRepository";
import { expect, test } from "vitest";

test("deve retornar uma lista de empresas", async () => {
  const empresaService = new EmpresaService(new EmpresaRepository());
  const empresas = await empresaService.obterTodas();
  expect(empresas).toBeDefined();
});

test("deve retornar um empresa", async () => {
  const empresaService = new EmpresaService(new EmpresaRepository());
  const empresa = await empresaService.obterPorId(1);
  expect(empresa).toBeDefined();
});

test("deve retornar um empresa pelo nome", async () => {
  const empresaService = new EmpresaService(new EmpresaRepository());
  const empresa = await empresaService.obterPorNome("Arena");
  expect(empresa).toBeDefined();
});
