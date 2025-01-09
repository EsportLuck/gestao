/*
  Warnings:

  - Added the required column `importacaoId` to the `Caixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importacaoId` to the `Comissao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importacaoId` to the `Liquido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importacaoId` to the `Premios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importacaoId` to the `Vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Caixa" ADD COLUMN     "importacaoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Comissao" ADD COLUMN     "importacaoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Liquido" ADD COLUMN     "importacaoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Premios" ADD COLUMN     "importacaoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vendas" ADD COLUMN     "importacaoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comissao" ADD CONSTRAINT "Comissao_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Premios" ADD CONSTRAINT "Premios_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquido" ADD CONSTRAINT "Liquido_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caixa" ADD CONSTRAINT "Caixa_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
