-- CreateIndex
CREATE INDEX "Appointment_status_startTime_idx" ON "Appointment"("status", "startTime");

-- CreateIndex
CREATE INDEX "Appointment_technicianId_startTime_idx" ON "Appointment"("technicianId", "startTime");
