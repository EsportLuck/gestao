/*
  Warnings:

  - Added the required column `quantity` to the `Vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendas" ADD COLUMN     "quantity" INTEGER NOT NULL;
