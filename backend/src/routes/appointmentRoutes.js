const express = require("express");

const {
    getAvailableSlots,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment
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

module.exports = router;