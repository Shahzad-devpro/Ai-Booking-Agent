const express = require("express");

const {
    getAvailableSlots,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointmentController
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/availability",
    authMiddleware,
    getAvailableSlots
);

router.post(
    "/",
    authMiddleware,
    createAppointment
);
router.get("/",
    authMiddleware,
    getAllAppointments
)
router.get(
    "/:id",
    authMiddleware,
    getAppointmentById
);
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelAppointment
);

router.patch(
    "/:id/reschedule",
    authMiddleware,
    rescheduleAppointmentController
);

module.exports = router;