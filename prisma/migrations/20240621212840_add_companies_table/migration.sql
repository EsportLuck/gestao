-- AlterTable
ALTER TABLE "Estabelecimento" ADD COLUMN     "companiesId" INTEGER;

-- CreateTable
CREATE TABLE "Companies" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Estabelecimento" ADD CONSTRAINT "Estabelecimento_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
