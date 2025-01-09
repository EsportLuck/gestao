/*
  Warnings:

  - Changed the type of `receiptImage` on the `Lancamentos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lancamentos" DROP COLUMN "receiptImage",
ADD COLUMN     "receiptImage" BYTEA NOT NULL;
