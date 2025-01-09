/*
  Warnings:

  - Added the required column `approved_by` to the `Lancamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recorded_by` to the `Lancamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lancamentos" ADD COLUMN     "approved_by" TEXT NOT NULL,
ADD COLUMN     "recorded_by" TEXT NOT NULL;
