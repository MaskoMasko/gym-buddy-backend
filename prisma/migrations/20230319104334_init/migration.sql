/*
  Warnings:

  - The `duration` column on the `Workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER[];
