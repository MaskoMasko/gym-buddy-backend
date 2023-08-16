/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `exercise_base_id` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `Statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EquipmentToWorkout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageToWorkout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VideoToWorkout` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `est_duration` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Statistics" DROP CONSTRAINT "Statistics_userId_fkey";

-- DropForeignKey
ALTER TABLE "Statistics" DROP CONSTRAINT "Statistics_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToWorkout" DROP CONSTRAINT "_EquipmentToWorkout_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToWorkout" DROP CONSTRAINT "_EquipmentToWorkout_B_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToWorkout" DROP CONSTRAINT "_ImageToWorkout_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToWorkout" DROP CONSTRAINT "_ImageToWorkout_B_fkey";

-- DropForeignKey
ALTER TABLE "_VideoToWorkout" DROP CONSTRAINT "_VideoToWorkout_A_fkey";

-- DropForeignKey
ALTER TABLE "_VideoToWorkout" DROP CONSTRAINT "_VideoToWorkout_B_fkey";

-- DropIndex
DROP INDEX "Workout_uuid_key";

-- AlterTable
CREATE SEQUENCE workout_id_seq;
ALTER TABLE "Workout" DROP COLUMN "categoryId",
DROP COLUMN "creation_date",
DROP COLUMN "description",
DROP COLUMN "exercise_base_id",
DROP COLUMN "name",
DROP COLUMN "uuid",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "est_duration" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('workout_id_seq');
ALTER SEQUENCE workout_id_seq OWNED BY "Workout"."id";

-- DropTable
DROP TABLE "Statistics";

-- DropTable
DROP TABLE "_EquipmentToWorkout";

-- DropTable
DROP TABLE "_ImageToWorkout";

-- DropTable
DROP TABLE "_VideoToWorkout";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER,
    "description" TEXT,
    "categoryId" INTEGER,
    "uuid" TEXT,
    "exercise_base_id" INTEGER,
    "creation_date" TEXT,
    "workoutId" INTEGER,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentToExercise" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_uuid_key" ON "Exercise"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentToExercise_AB_unique" ON "_EquipmentToExercise"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentToExercise_B_index" ON "_EquipmentToExercise"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToImage_AB_unique" ON "_ExerciseToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToImage_B_index" ON "_ExerciseToImage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToVideo_AB_unique" ON "_ExerciseToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToVideo_B_index" ON "_ExerciseToVideo"("B");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToImage" ADD CONSTRAINT "_ExerciseToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToImage" ADD CONSTRAINT "_ExerciseToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToVideo" ADD CONSTRAINT "_ExerciseToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToVideo" ADD CONSTRAINT "_ExerciseToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
