/*
  Warnings:

  - You are about to drop the column `empresa` on the `Estabelecimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Estabelecimento" DROP COLUMN "empresa",
ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Localidade" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Rota" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Secao" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Supervisor" ADD COLUMN     "empresaId" INTEGER;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_name_key" ON "Empresa"("name");

-- AddForeignKey
ALTER TABLE "Estabelecimento" ADD CONSTRAINT "Estabelecimento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidade" ADD CONSTRAINT "Localidade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secao" ADD CONSTRAINT "Secao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rota" ADD CONSTRAINT "Rota_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
