-- CreateTable
CREATE TABLE "GymLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "GymLocation_pkey" PRIMARY KEY ("id")
);
