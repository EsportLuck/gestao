-- AlterTable
ALTER TABLE "Ciclo" ADD COLUMN     "empresaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ciclo" ADD CONSTRAINT "Ciclo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
