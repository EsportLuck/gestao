-- CreateTable
CREATE TABLE "Cronjob" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cronjob_pkey" PRIMARY KEY ("id")
);
