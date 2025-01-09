/*
  Warnings:

  - Added the required column `receiptImage` to the `Lancamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lancamentos" ADD COLUMN     "receiptImage" TEXT NOT NULL;
