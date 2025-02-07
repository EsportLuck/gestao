import { xlsxReader } from "@/app/api/controller";
import { createTempfile } from "../v1/(routes)/import/utils";
import fs from "node:fs";

export const createWorkSheet = async (file: File, tipo?: string) => {
  const pathFile: string = await createTempfile(file);

  let dataFile = xlsxReader.readFile(pathFile, {
    type: "string",
  });

  if (tipo === "fratec") {
    const fileData = fs.readFileSync(pathFile, { encoding: "latin1" });
    const bufferData = Buffer.from(fileData);
    dataFile = xlsxReader.read(bufferData, {
      type: "buffer",
      raw: true,
    });
    const worksheet = dataFile.Sheets[dataFile.SheetNames[0]];
    return worksheet;
  }
  if (
    tipo === "4712 - arena sportluck" ||
    tipo === "4713 - estancia" ||
    tipo === "7501 - rota sportluck andre" ||
    tipo === "7503 - rota luck"
  ) {
    const fileData = fs.readFileSync(pathFile, { encoding: "latin1" });
    const bufferData = Buffer.from(fileData);
    dataFile = xlsxReader.read(bufferData, {
      type: "buffer",
      raw: true,
    });
  }

  if (tipo === "arena.site") {
    dataFile = xlsxReader.readFile(pathFile, {
      raw: true,
    });
    const worksheet = dataFile.Sheets[dataFile.SheetNames[1]];
    return worksheet;
  }
  if (tipo === "sportshow - wendel alagoas sup") {
    dataFile = xlsxReader.readFile(pathFile, {
      raw: true,
    });
    const worksheet = [];
    for (const sheet of dataFile.SheetNames) {
      worksheet.push(dataFile.Sheets[sheet]);
    }
    return worksheet;
  }
  const worksheet = dataFile.Sheets[dataFile.SheetNames[0]];

  return worksheet;
};
