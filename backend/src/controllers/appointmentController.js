const availabilityService = require("../services/availabilityService");
const appointmentService = require("../services/appointmentService");
const {
    rescheduleAppointment
} = require("../services/appointmentService");

const getAvailableSlots = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        const slots =
            await availabilityService.getAvailableSlots(date);

        res.status(200).json({
            success: true,
            data: {
                date,
                slots
            }
        });
    } catch (error) {
        next(error);
    }
};

const createAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.createAppointment(req.body);

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const getAllAppointments = async (req, res, next) => {
    try {
        const {
            status,
            page = 1,
            limit = 10
        } = req.query;

        const result =
            await appointmentService.getAllAppointments({
                status,
                page: Number(page),
                limit: Number(limit)
            });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const appointment =
            await appointmentService.getAppointmentById(id);

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const appointment =
            await appointmentService.cancelAppointment(id);

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const rescheduleAppointmentController = async (req, res, next) => {

    try {

        const appointment =
            await rescheduleAppointment({
                appointmentId: req.params.id,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            });


        res.status(200).json({
            success: true,
            message: "Appointment rescheduled successfully",
            data: appointment
        });

    } catch (error) {

        next(error);

    }
};

module.exports = {
    getAvailableSlots,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointmentController
};