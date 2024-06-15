-- CreateTable
CREATE TABLE "CheckMail" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "CheckMail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckMail_id_key" ON "CheckMail"("id");
