const { DateTime } = require("luxon");

const prisma = require("../config/database");

const {
    BUSINESS_TIMEZONE,
    BUSINESS_START_HOUR,
    BUSINESS_END_HOUR,
    SLOT_DURATION_HOURS
} = require("../config/businessConfig");


/*
|--------------------------------------------------------------------------
| CREATE APPOINTMENT
|--------------------------------------------------------------------------
*/

const createAppointment = async ({
    leadId,
    customerId,
    startTime,
    endTime,
    notes
}) => {

    // ---------------------------------------------------------
    // 1. Validate required fields
    // ---------------------------------------------------------

    if (!leadId || !customerId || !startTime || !endTime) {
        const error = new Error(
            "leadId, customerId, startTime and endTime are required"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 2. Convert incoming times to New York timezone
    // ---------------------------------------------------------

    const start = DateTime.fromISO(startTime, {
        setZone: true
    }).setZone(BUSINESS_TIMEZONE);

    const end = DateTime.fromISO(endTime, {
        setZone: true
    }).setZone(BUSINESS_TIMEZONE);


    // ---------------------------------------------------------
    // 3. Validate dates
    // ---------------------------------------------------------

    if (!start.isValid || !end.isValid) {
        const error = new Error(
            "Invalid appointment time"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 4. Appointment must not be in the past
    // ---------------------------------------------------------

    const now = DateTime.now()
        .setZone(BUSINESS_TIMEZONE);

    if (start <= now) {
        const error = new Error(
            "Appointment cannot be booked in the past"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 5. Sunday is closed
    // ---------------------------------------------------------

    if (start.weekday === 7) {
        const error = new Error(
            "Appointments are not available on Sunday"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 6. End time must be after start time
    // ---------------------------------------------------------

    if (end.toMillis() <= start.toMillis()) {
        const error = new Error(
            "Appointment end time must be after start time"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 7. Appointment must be exactly 1 hour
    // ---------------------------------------------------------

    const durationInMinutes =
        end.diff(start, "minutes").minutes;

    const requiredDuration =
        SLOT_DURATION_HOURS * 60;

    if (durationInMinutes !== requiredDuration) {
        const error = new Error(
            `Appointment must be exactly ${SLOT_DURATION_HOURS} hour`
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 8. Appointment must start on full hour
    // ---------------------------------------------------------

    if (
        start.minute !== 0 ||
        start.second !== 0 ||
        start.millisecond !== 0
    ) {
        const error = new Error(
            "Appointments must start on a full-hour slot"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 9. Create business hours for requested day
    // ---------------------------------------------------------

    const businessStart = start.startOf("day").set({
        hour: BUSINESS_START_HOUR,
        minute: 0,
        second: 0,
        millisecond: 0
    });

    const businessEnd = start.startOf("day").set({
        hour: BUSINESS_END_HOUR,
        minute: 0,
        second: 0,
        millisecond: 0
    });


    // ---------------------------------------------------------
    // 10. Appointment must be inside business hours
    // ---------------------------------------------------------

    if (
        start.toMillis() < businessStart.toMillis() ||
        end.toMillis() > businessEnd.toMillis()
    ) {
        const error = new Error(
            `Appointment must be within business hours: ${BUSINESS_START_HOUR}:00 AM - ${BUSINESS_END_HOUR}:00 PM`
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 11. Convert New York time to UTC for PostgreSQL
    // ---------------------------------------------------------

    const startUTC = start
        .toUTC()
        .toJSDate();

    const endUTC = end
        .toUTC()
        .toJSDate();


    // ---------------------------------------------------------
    // 12. Check that lead exists
    // ---------------------------------------------------------

    const lead = await prisma.lead.findUnique({
        where: {
            id: leadId
        }
    });

    if (!lead) {
        const error = new Error(
            "Lead not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // ---------------------------------------------------------
    // 13. Check that customer exists
    // ---------------------------------------------------------

    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId
        }
    });

    if (!customer) {
        const error = new Error(
            "Customer not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // ---------------------------------------------------------
    // 14. Make sure lead belongs to customer
    // ---------------------------------------------------------

    if (lead.customerId !== customerId) {
        const error = new Error(
            "Lead does not belong to this customer"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 15. Check if lead already has appointment
    // ---------------------------------------------------------

    const existingAppointment =
        await prisma.appointment.findUnique({
            where: {
                leadId
            }
        });

    if (existingAppointment) {
        const error = new Error(
            "This lead already has an appointment"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 16. Check appointment conflict
    // ---------------------------------------------------------

    const conflictingAppointment =
        await prisma.appointment.findFirst({
            where: {
                status: "BOOKED",

                startTime: {
                    lt: endUTC
                },

                endTime: {
                    gt: startUTC
                }
            }
        });

    if (conflictingAppointment) {
        const error = new Error(
            "This appointment slot is no longer available"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 17. Create appointment
    // ---------------------------------------------------------

    const appointment =
        await prisma.appointment.create({
            data: {
                customerId,
                leadId,

                startTime: startUTC,
                endTime: endUTC,

                notes: notes || null
            },

            include: {
                customer: true,
                lead: true
            }
        });


    // ---------------------------------------------------------
    // 18. Update lead status
    // ---------------------------------------------------------

    await prisma.lead.update({
        where: {
            id: leadId
        },

        data: {
            status: "BOOKED"
        }
    });


    // ---------------------------------------------------------
    // 19. Return appointment
    // ---------------------------------------------------------

    return appointment;
};


/*
|--------------------------------------------------------------------------
| GET ALL APPOINTMENTS
|--------------------------------------------------------------------------
*/

const getAllAppointments = async ({
    status,
    page = 1,
    limit = 10
}) => {

    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }


    const [appointments, total] =
        await Promise.all([

            prisma.appointment.findMany({
                where,

                include: {
                    customer: true,
                    lead: true
                },

                orderBy: {
                    startTime: "asc"
                },

                skip,
                take: limit
            }),

            prisma.appointment.count({
                where
            })
        ]);


    return {
        appointments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};


/*
|--------------------------------------------------------------------------
| GET APPOINTMENT BY ID
|--------------------------------------------------------------------------
*/

const getAppointmentById = async (id) => {

    if (!id) {
        const error = new Error(
            "Appointment ID is required"
        );

        error.statusCode = 400;
        throw error;
    }


    const appointment =
        await prisma.appointment.findUnique({

            where: {
                id
            },

            include: {
                customer: true,
                lead: true
            }
        });


    if (!appointment) {
        const error = new Error(
            "Appointment not found"
        );

        error.statusCode = 404;
        throw error;
    }


    return appointment;
};


/*
|--------------------------------------------------------------------------
| CANCEL APPOINTMENT
|--------------------------------------------------------------------------
*/

const cancelAppointment = async (id) => {

    if (!id) {
        const error = new Error(
            "Appointment ID is required"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 1. Find appointment
    // ---------------------------------------------------------

    const appointment =
        await prisma.appointment.findUnique({
            where: {
                id
            }
        });


    if (!appointment) {
        const error = new Error(
            "Appointment not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // ---------------------------------------------------------
    // 2. Prevent duplicate cancellation
    // ---------------------------------------------------------

    if (appointment.status === "CANCELLED") {
        const error = new Error(
            "Appointment is already cancelled"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 3. Completed appointments cannot be cancelled
    // ---------------------------------------------------------

    if (appointment.status === "COMPLETED") {
        const error = new Error(
            "Completed appointment cannot be cancelled"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 4. Cancel appointment
    // ---------------------------------------------------------

    const cancelledAppointment =
        await prisma.appointment.update({

            where: {
                id
            },

            data: {
                status: "CANCELLED"
            },

            include: {
                customer: true,
                lead: true
            }
        });


    // ---------------------------------------------------------
    // 5. Update lead status
    // ---------------------------------------------------------

    await prisma.lead.update({

        where: {
            id: appointment.leadId
        },

        data: {
            status: "CANCELLED"
        }
    });


    return cancelledAppointment;
};


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment
};