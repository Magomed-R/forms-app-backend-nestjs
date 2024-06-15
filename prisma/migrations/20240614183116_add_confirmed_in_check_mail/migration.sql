/*
  Warnings:

  - Added the required column `confirmed` to the `CheckMail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckMail" ADD COLUMN     "confirmed" BOOLEAN NOT NULL;
