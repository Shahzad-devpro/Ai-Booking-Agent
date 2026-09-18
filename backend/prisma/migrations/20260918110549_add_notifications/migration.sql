-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LEAD_CREATED', 'APPOINTMENT_BOOKED', 'APPOINTMENT_CANCELLED', 'APPOINTMENT_RESCHEDULED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "leadCreated" BOOLEAN NOT NULL DEFAULT true,
    "appointmentBooked" BOOLEAN NOT NULL DEFAULT true,
    "appointmentCancelled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentRescheduled" BOOLEAN NOT NULL DEFAULT true,
    "customerEmails" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_readAt_idx" ON "Notification"("readAt");

-- CreateIndex
CREATE INDEX "Notification_type_createdAt_idx" ON "Notification"("type", "createdAt");
