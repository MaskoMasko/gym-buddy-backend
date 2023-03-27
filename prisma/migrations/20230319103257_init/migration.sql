-- CreateTable
CREATE TABLE "Wokrout" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "requirements" TEXT NOT NULL,

    CONSTRAINT "Wokrout_pkey" PRIMARY KEY ("id")
);
