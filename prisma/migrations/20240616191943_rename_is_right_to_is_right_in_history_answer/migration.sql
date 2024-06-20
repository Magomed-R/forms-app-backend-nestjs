/*
  Warnings:

  - You are about to drop the column `is_right` on the `HistoryAnswer` table. All the data in the column will be lost.
  - Added the required column `isRight` to the `HistoryAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryAnswer" DROP COLUMN "is_right",
ADD COLUMN     "isRight" BOOLEAN NOT NULL;
