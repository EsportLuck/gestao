/*
  Warnings:

  - You are about to drop the column `status_pagamento` on the `Estabelecimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Estabelecimento" DROP COLUMN "status_pagamento",
ALTER COLUMN "status_atividade" SET DEFAULT 'ATIVO';

-- CreateTable
CREATE TABLE "Ciclo" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "establishmentId" INTEGER NOT NULL,

    CONSTRAINT "Ciclo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ciclo" ADD CONSTRAINT "Ciclo_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
