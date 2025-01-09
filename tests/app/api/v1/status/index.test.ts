// crie um test que der fech que faça um get na rota /api/v1/status e retorne 200
import { expect, it } from "vitest";

it("Testando rotas", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status", {
    method: "GET",
  });
  expect(response.status).toBe(200);
});
