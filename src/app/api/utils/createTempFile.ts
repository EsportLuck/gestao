import os from "node:os";
import path from "node:path";
import { writeFile } from "node:fs/promises";
export const createTempfile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const diretorioTemporario = os.tmpdir();
  const caminhoCompleto = path.join(diretorioTemporario, `${file.name}`);
  await writeFile(caminhoCompleto, buffer);
  return caminhoCompleto;
};
