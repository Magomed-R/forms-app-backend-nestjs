/*
  Warnings:

  - You are about to drop the column `public` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "public",
ADD COLUMN     "open" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ready" BOOLEAN NOT NULL DEFAULT false;
