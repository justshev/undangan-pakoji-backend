-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "totalInvited" INTEGER NOT NULL DEFAULT 0,
    "confirmedGuests" INTEGER NOT NULL DEFAULT 0,
    "qrCodeToken" TEXT,
    "isArrived" BOOLEAN NOT NULL DEFAULT false,
    "arrivalTime" TIMESTAMP(3),

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_qrCodeToken_key" ON "public"."Guest"("qrCodeToken");
