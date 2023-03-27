/*
  Warnings:

  - You are about to drop the column `requirements` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `equipment` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "requirements",
ADD COLUMN     "equipment" TEXT NOT NULL;
