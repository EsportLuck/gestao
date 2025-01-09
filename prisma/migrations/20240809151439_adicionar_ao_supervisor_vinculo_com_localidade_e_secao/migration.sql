-- AlterTable
ALTER TABLE "Localidade" ADD COLUMN     "Supervisorid" INTEGER;

-- AlterTable
ALTER TABLE "Secao" ADD COLUMN     "Supervisorid" INTEGER;

-- AddForeignKey
ALTER TABLE "Localidade" ADD CONSTRAINT "Localidade_Supervisorid_fkey" FOREIGN KEY ("Supervisorid") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secao" ADD CONSTRAINT "Secao_Supervisorid_fkey" FOREIGN KEY ("Supervisorid") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
