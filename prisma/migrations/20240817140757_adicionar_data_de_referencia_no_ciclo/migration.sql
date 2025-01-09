/*
  Warnings:

  - Added the required column `reference_date` to the `Ciclo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ciclo" ADD COLUMN     "reference_date" TIMESTAMP(3) NOT NULL;
