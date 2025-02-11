/*
  Warnings:

  - You are about to drop the column `answer` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `userAnswer` on the `Assessment` table. All the data in the column will be lost.
  - Added the required column `quizScore` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "answer",
DROP COLUMN "question",
DROP COLUMN "score",
DROP COLUMN "userAnswer",
ADD COLUMN     "improvementTip" TEXT,
ADD COLUMN     "questions" JSONB[],
ADD COLUMN     "quizScore" DOUBLE PRECISION NOT NULL;
