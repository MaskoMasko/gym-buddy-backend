/*
  Warnings:

  - Changed the type of `equipment` on the `Workout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "equipment",
ADD COLUMN     "equipment" BOOLEAN NOT NULL;
