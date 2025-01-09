/*
  Warnings:

  - You are about to drop the column `site` on the `Caixa` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Caixa` table. All the data in the column will be lost.
  - You are about to drop the `StatusPagamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Caixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Caixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Caixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Liquido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Premios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StatusPagamento" DROP CONSTRAINT "StatusPagamento_estabelecimentoId_fkey";

-- AlterTable
ALTER TABLE "Caixa" DROP COLUMN "site",
DROP COLUMN "value",
ADD COLUMN     "bicho" TEXT,
ADD COLUMN     "futebol" TEXT,
ADD COLUMN     "loteria" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value_bicho" INTEGER,
ADD COLUMN     "value_futebol" INTEGER,
ADD COLUMN     "value_loteria" INTEGER;

-- AlterTable
ALTER TABLE "Liquido" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Premios" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "StatusPagamento";
