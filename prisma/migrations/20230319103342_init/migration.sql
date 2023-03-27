/*
  Warnings:

  - You are about to drop the `Wokrout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Wokrout";

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "requirements" TEXT NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);
