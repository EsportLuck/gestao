-- DropForeignKey
ALTER TABLE "Observacao" DROP CONSTRAINT "Observacao_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Observacao" DROP CONSTRAINT "Observacao_lancamentoId_fkey";

-- AlterTable
ALTER TABLE "Observacao" ALTER COLUMN "establishmentId" DROP NOT NULL,
ALTER COLUMN "lancamentoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Observacao" ADD CONSTRAINT "Observacao_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Estabelecimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacao" ADD CONSTRAINT "Observacao_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "Lancamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
