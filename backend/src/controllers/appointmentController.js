const availabilityService =
    require("../services/availabilityService");

const appointmentService =
    require("../services/appointmentService");

const {
    rescheduleAppointment
} =
    require("../services/appointmentService");


// ============================================================
// GET AVAILABLE SLOTS
// ============================================================

const getAvailableSlots =
    async (req, res, next) => {

        try {

            const {
                date
            } = req.query;


            if (!date) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Date is required"
                });

            }


            const slots =
                await availabilityService
                    .getAvailableSlots(
                        date
                    );


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


// ============================================================
// GET ACTIVE TECHNICIANS
// ============================================================

const getActiveTechnicians =
    async (req, res, next) => {

        try {

            const technicians =
                await appointmentService
                    .getActiveTechnicians();


            res.status(200).json({

                success: true,

                data: technicians

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// CREATE APPOINTMENT
// ============================================================

const createAppointment =
    async (req, res, next) => {

        try {

            const appointment =
                await appointmentService
                    .createAppointment(
                        req.body
                    );


            res.status(201).json({

                success: true,

                message:
                    "Appointment booked successfully",

                data: appointment

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET ALL APPOINTMENTS
// ============================================================

const getAllAppointments =
    async (req, res, next) => {

        try {

            const {
                status,
                search = "",
                technicianId = "",
                date = "",
                page = 1,
                limit = 10
            } = req.query;


            const pageNumber =
                Number(page);


            const limitNumber =
                Number(limit);


            const result =
                await appointmentService
                    .getAllAppointments({

                        status,

                        search,

                        technicianId,

                        date,

                        page:
                            Number.isInteger(
                                pageNumber
                            ) &&
                            pageNumber > 0
                                ? pageNumber
                                : 1,

                        limit:
                            Number.isInteger(
                                limitNumber
                            ) &&
                            limitNumber > 0
                                ? Math.min(
                                    limitNumber,
                                    50
                                )
                                : 10

                    });


            res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET APPOINTMENT BY ID
// ============================================================

const getAppointmentById =
    async (req, res, next) => {

        try {

            const {
                id
            } = req.params;


            const appointment =
                await appointmentService
                    .getAppointmentById(
                        id
                    );


            res.status(200).json({

                success: true,

                data: appointment

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment =
    async (req, res, next) => {

        try {

            const {
                id
            } = req.params;


            const appointment =
                await appointmentService
                    .cancelAppointment(
                        id
                    );


            res.status(200).json({

                success: true,

                message:
                    "Appointment cancelled successfully",

                data: appointment

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// RESCHEDULE
// ============================================================

const rescheduleAppointmentController =
    async (req, res, next) => {

        try {

            const appointment =
                await rescheduleAppointment({

                    appointmentId:
                        req.params.id,

                    startTime:
                        req.body.startTime,

                    endTime:
                        req.body.endTime

                });


            res.status(200).json({

                success: true,

                message:
                    "Appointment rescheduled successfully",

                data: appointment

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// MANUAL TECHNICIAN ASSIGNMENT
// ============================================================

const assignTechnician =
    async (req, res, next) => {

        try {

            const {
                id
            } = req.params;


            const {
                technicianId
            } = req.body;


            if (!technicianId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Technician ID is required"

                });

            }


            const appointment =
                await appointmentService
                    .assignTechnician({

                        appointmentId:
                            id,

                        technicianId

                    });


            res.status(200).json({

                success: true,

                message:
                    "Technician assigned successfully",

                data: appointment

            });

        } catch (error) {

            next(error);

        }
    };


module.exports = {

    getAvailableSlots,

    getActiveTechnicians,

    createAppointment,

    getAllAppointments,

    getAppointmentById,

    cancelAppointment,

    rescheduleAppointmentController,

    assignTechnician

};