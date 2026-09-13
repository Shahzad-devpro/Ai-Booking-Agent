-- Add technicianId as nullable first
ALTER TABLE "Appointment"
ADD COLUMN "technicianId" TEXT;

-- Create Technician table
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Technician_active_idx"
ON "Technician"("active");

CREATE INDEX "Appointment_technicianId_idx"
ON "Appointment"("technicianId");

-- Add foreign key
ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_technicianId_fkey"
FOREIGN KEY ("technicianId")
REFERENCES "Technician"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;