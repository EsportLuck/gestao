-- DropForeignKey
ALTER TABLE "Caixa" DROP CONSTRAINT "Caixa_importacaoId_fkey";

-- AlterTable
ALTER TABLE "Caixa" ALTER COLUMN "importacaoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Caixa" ADD CONSTRAINT "Caixa_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "Importacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
