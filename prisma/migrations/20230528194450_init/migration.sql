/*
  Warnings:

  - Changed the type of `duration` on the `Workout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;
