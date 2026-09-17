const express =
    require("express");


const {
    getAvailableSlots,
    getActiveTechnicians,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointmentController,
    assignTechnician
} =
    require("../controllers/appointmentController");


const authMiddleware =
    require("../middleware/authMiddleware");


const router =
    express.Router();


// ============================================================
// AVAILABILITY
// ============================================================

router.get(
    "/availability",
    authMiddleware,
    getAvailableSlots
);


// ============================================================
// ACTIVE TECHNICIANS
// IMPORTANT: MUST COME BEFORE /:id
// ============================================================

router.get(
    "/technicians",
    authMiddleware,
    getActiveTechnicians
);


// ============================================================
// APPOINTMENTS
// ============================================================

router.post(
    "/",
    authMiddleware,
    createAppointment
);


router.get(
    "/",
    authMiddleware,
    getAllAppointments
);


// ============================================================
// APPOINTMENT DETAIL
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    getAppointmentById
);


// ============================================================
// CANCEL
// ============================================================

router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelAppointment
);


// ============================================================
// RESCHEDULE
// ============================================================

router.patch(
    "/:id/reschedule",
    authMiddleware,
    rescheduleAppointmentController
);


// ============================================================
// MANUAL TECHNICIAN ASSIGNMENT
// ============================================================

router.patch(
    "/:id/technician",
    authMiddleware,
    assignTechnician
);


module.exports =
    router;