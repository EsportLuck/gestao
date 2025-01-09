-- CreateTable
CREATE TABLE "Negativo" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "referenceDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "establishmentId" INTEGER NOT NULL,

    CONSTRAINT "Negativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestacao" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "referenceDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "establishmentId" INTEGER NOT NULL,

    CONSTRAINT "Prestacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Negativo" ADD CONSTRAINT "Negativo_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestacao" ADD CONSTRAINT "Prestacao_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
