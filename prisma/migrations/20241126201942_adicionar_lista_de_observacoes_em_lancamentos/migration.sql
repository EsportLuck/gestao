/*
  Warnings:

  - You are about to drop the column `observation` on the `Lancamentos` table. All the data in the column will be lost.
  - Added the required column `lancamentoId` to the `Observacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lancamentos" DROP COLUMN "observation";

-- AlterTable
ALTER TABLE "Observacao" ADD COLUMN     "lancamentoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Observacao" ADD CONSTRAINT "Observacao_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "Lancamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
