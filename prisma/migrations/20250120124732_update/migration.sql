/*
  Warnings:

  - Added the required column `companyName` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CoverLetter_userId_key";

-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");
