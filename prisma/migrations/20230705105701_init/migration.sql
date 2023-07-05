-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "chatRoomId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "GymLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "uuid" TEXT,
    "exercise_base" INTEGER,
    "exercise_base_uuid" INTEGER,
    "is_main" BOOLEAN,
    "style" TEXT,
    "license" INTEGER,
    "license_title" TEXT,
    "license_author" TEXT,
    "license_author_url" TEXT,
    "license_object_url" TEXT,
    "license_derivative_source_url" TEXT,
    "author_history" TEXT[],

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL,
    "video" TEXT NOT NULL,
    "uuid" TEXT,
    "exercise_base" INTEGER,
    "exercise_base_uuid" INTEGER,
    "is_main" BOOLEAN,
    "size" INTEGER,
    "duration" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "codec" TEXT,
    "codec_long" TEXT,
    "license" INTEGER,
    "license_title" TEXT,
    "license_author" TEXT,
    "license_author_url" TEXT,
    "license_object_url" TEXT,
    "license_derivative_source_url" TEXT,
    "author_history" TEXT[],

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,
    "exercise_base_id" INTEGER NOT NULL,
    "creation_date" TEXT NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatRoomParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EquipmentToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ImageToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_VideoToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_uuid_key" ON "Workout"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_Friends_AB_unique" ON "_Friends"("A", "B");

-- CreateIndex
CREATE INDEX "_Friends_B_index" ON "_Friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomParticipants_AB_unique" ON "_ChatRoomParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomParticipants_B_index" ON "_ChatRoomParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentToWorkout_AB_unique" ON "_EquipmentToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentToWorkout_B_index" ON "_EquipmentToWorkout"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToWorkout_AB_unique" ON "_ImageToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToWorkout_B_index" ON "_ImageToWorkout"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToWorkout_AB_unique" ON "_VideoToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToWorkout_B_index" ON "_VideoToWorkout"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends" ADD CONSTRAINT "_Friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomParticipants" ADD CONSTRAINT "_ChatRoomParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomParticipants" ADD CONSTRAINT "_ChatRoomParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToWorkout" ADD CONSTRAINT "_EquipmentToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToWorkout" ADD CONSTRAINT "_EquipmentToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToWorkout" ADD CONSTRAINT "_ImageToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToWorkout" ADD CONSTRAINT "_ImageToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToWorkout" ADD CONSTRAINT "_VideoToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToWorkout" ADD CONSTRAINT "_VideoToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
