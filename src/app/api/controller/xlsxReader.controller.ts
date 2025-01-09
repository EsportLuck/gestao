import * as xlsx from "xlsx";
import fs from "node:fs";

export class xlsxReader {
  public static readFile(
    filePath: any,
    opts?: xlsx.ParsingOptions,
  ): xlsx.WorkBook {
    try {
      xlsx.set_fs(fs);
      return xlsx.readFile(filePath, opts);
    } catch (error) {
      console.error("xlsxReader read", error);
      throw error;
    }
  }
  public static read(filePath: any, opts?: xlsx.ParsingOptions): xlsx.WorkBook {
    try {
      xlsx.set_fs(fs);
      return xlsx.read(filePath, opts);
    } catch (error) {
      console.error("xlsxReader read", error);
      throw error;
    }
  }

  public static toJson<T>(
    workbook: xlsx.WorkSheet,
    opts?: xlsx.Sheet2JSONOpts,
  ): T[] {
    try {
      return xlsx.utils.sheet_to_json<T>(workbook, opts);
    } catch (error) {
      console.error("xlsxReader toJson", error);
      throw error;
    }
  }
}
