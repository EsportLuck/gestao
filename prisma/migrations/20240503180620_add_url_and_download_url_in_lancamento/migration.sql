/*
  Warnings:

  - You are about to drop the column `receiptImage` on the `Lancamentos` table. All the data in the column will be lost.
  - Added the required column `downloadUrl` to the `Lancamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Lancamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lancamentos" DROP COLUMN "receiptImage",
ADD COLUMN     "downloadUrl" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "observation" DROP NOT NULL,
ALTER COLUMN "approved_by" DROP NOT NULL;
