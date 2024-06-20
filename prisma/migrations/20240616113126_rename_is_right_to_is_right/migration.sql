/*
  Warnings:

  - You are about to drop the column `is_right` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `isRight` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "is_right",
ADD COLUMN     "isRight" BOOLEAN NOT NULL;
