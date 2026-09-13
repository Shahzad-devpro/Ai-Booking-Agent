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
    // 9. Create business hours
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
    // 11. Convert New York time to UTC
    // ---------------------------------------------------------

    const startUTC = start
        .toUTC()
        .toJSDate();

    const endUTC = end
        .toUTC()
        .toJSDate();


    // ---------------------------------------------------------
    // 12. Check lead
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
    // 13. Check customer
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
    // 16. Get active technicians
    // ---------------------------------------------------------

    const activeTechnicians =
        await prisma.technician.findMany({
            where: {
                active: true
            },

            select: {
                id: true,
                name: true
            }
        });


    // ---------------------------------------------------------
    // 17. Make sure technicians exist
    // ---------------------------------------------------------

    if (activeTechnicians.length === 0) {
        const error = new Error(
            "No technicians are currently available"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 18. Find technicians already booked during slot
    // ---------------------------------------------------------

    const conflictingAppointments =
        await prisma.appointment.findMany({
            where: {
                status: "BOOKED",

                technicianId: {
                    not: null
                },

                startTime: {
                    lt: endUTC
                },

                endTime: {
                    gt: startUTC
                }
            },

            select: {
                technicianId: true
            }
        });


    // ---------------------------------------------------------
    // 19. Create Set of booked technicians
    // ---------------------------------------------------------

    const bookedTechnicianIds =
        new Set(
            conflictingAppointments
                .map(
                    appointment =>
                        appointment.technicianId
                )
        );


    // ---------------------------------------------------------
    // 20. Find available technicians
    // ---------------------------------------------------------

    const availableTechnicians =
        activeTechnicians.filter(
            technician =>
                !bookedTechnicianIds.has(
                    technician.id
                )
        );


    // ---------------------------------------------------------
    // 21. No technician available
    // ---------------------------------------------------------

    if (availableTechnicians.length === 0) {
        const error = new Error(
            "No technician is available for this appointment slot"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 22. Automatically assign technician
    // ---------------------------------------------------------

    const assignedTechnician =
        availableTechnicians[0];


    // ---------------------------------------------------------
// 23. Create appointment + update lead in transaction
// ---------------------------------------------------------

const appointment = await prisma.$transaction(async (tx) => {

    // Create appointment
    const newAppointment =
        await tx.appointment.create({
            data: {
                customerId,
                leadId,

                technicianId:
                    assignedTechnician.id,

                startTime: startUTC,
                endTime: endUTC,

                notes: notes || null
            }
        });


    // Update lead status
    await tx.lead.update({
        where: {
            id: leadId
        },

        data: {
            status: "BOOKED"
        }
    });


    return newAppointment;
});


// ---------------------------------------------------------
// 24. Fetch complete updated appointment
// ---------------------------------------------------------

const completeAppointment =
    await prisma.appointment.findUnique({
        where: {
            id: appointment.id
        },

        include: {
            customer: true,
            lead: true,
            technician: true
        }
    });


// ---------------------------------------------------------
// 25. Return appointment
// ---------------------------------------------------------

return completeAppointment;

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
    // 4. Cancel appointment + update lead atomically
    // ---------------------------------------------------------

    const cancelledAppointment =
        await prisma.$transaction(async (tx) => {

            // Cancel appointment
            await tx.appointment.update({
                where: {
                    id
                },

                data: {
                    status: "CANCELLED"
                }
            });


            // Update lead
            await tx.lead.update({
                where: {
                    id: appointment.leadId
                },

                data: {
                    status: "CANCELLED"
                }
            });


            return true;
        });


    // ---------------------------------------------------------
    // 5. Fetch fresh updated appointment
    // ---------------------------------------------------------

    const completeCancelledAppointment =
        await prisma.appointment.findUnique({

            where: {
                id
            },

            include: {
                customer: true,
                lead: true,
                technician: true
            }
        });


    return completeCancelledAppointment;
};


const rescheduleAppointment = async ({
    appointmentId,
    startTime,
    endTime
}) => {

    // ---------------------------------------------------------
    // 1. Validate input
    // ---------------------------------------------------------

    if (!appointmentId || !startTime || !endTime) {
        const error = new Error(
            "Appointment ID, startTime and endTime are required"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 2. Parse requested time
    // ---------------------------------------------------------

    const start = DateTime.fromISO(startTime, {
        setZone: true
    }).setZone(BUSINESS_TIMEZONE);

    const end = DateTime.fromISO(endTime, {
        setZone: true
    }).setZone(BUSINESS_TIMEZONE);


    if (!start.isValid || !end.isValid) {
        const error = new Error(
            "Invalid appointment time"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 3. Find existing appointment
    // ---------------------------------------------------------

    const appointment =
        await prisma.appointment.findUnique({
            where: {
                id: appointmentId
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
    // 4. Appointment status validation
    // ---------------------------------------------------------

    if (appointment.status === "CANCELLED") {
        const error = new Error(
            "Cancelled appointment cannot be rescheduled"
        );

        error.statusCode = 409;
        throw error;
    }


    if (appointment.status === "COMPLETED") {
        const error = new Error(
            "Completed appointment cannot be rescheduled"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 5. Prevent past appointments
    // ---------------------------------------------------------

    const now = DateTime.now()
        .setZone(BUSINESS_TIMEZONE);


    if (start <= now) {
        const error = new Error(
            "Appointment cannot be rescheduled to a past time"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 6. Sunday validation
    // ---------------------------------------------------------

    if (start.weekday === 7) {
        const error = new Error(
            "Appointments are not available on Sunday"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 7. End time validation
    // ---------------------------------------------------------

    if (end.toMillis() <= start.toMillis()) {
        const error = new Error(
            "Appointment end time must be after start time"
        );

        error.statusCode = 400;
        throw error;
    }


    // ---------------------------------------------------------
    // 8. Exact duration validation
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
    // 9. Full-hour validation
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
    // 10. Business hours validation
    // ---------------------------------------------------------

    const businessStart =
        start.startOf("day").set({
            hour: BUSINESS_START_HOUR,
            minute: 0,
            second: 0,
            millisecond: 0
        });


    const businessEnd =
        start.startOf("day").set({
            hour: BUSINESS_END_HOUR,
            minute: 0,
            second: 0,
            millisecond: 0
        });


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
    // 11. Convert to UTC
    // ---------------------------------------------------------

    const startUTC =
        start.toUTC().toJSDate();

    const endUTC =
        end.toUTC().toJSDate();


    // ---------------------------------------------------------
    // 12. Find active technicians
    // ---------------------------------------------------------

    const activeTechnicians =
        await prisma.technician.findMany({
            where: {
                active: true
            },

            select: {
                id: true,
                name: true
            }
        });


    if (activeTechnicians.length === 0) {
        const error = new Error(
            "No technicians are currently available"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 13. Find conflicting appointments
    // ---------------------------------------------------------

    const conflictingAppointments =
        await prisma.appointment.findMany({
            where: {
                status: "BOOKED",

                technicianId: {
                    not: null
                },

                // IMPORTANT:
                // Ignore the appointment we are rescheduling
                id: {
                    not: appointmentId
                },

                startTime: {
                    lt: endUTC
                },

                endTime: {
                    gt: startUTC
                }
            },

            select: {
                technicianId: true
            }
        });


    // ---------------------------------------------------------
    // 14. Determine available technicians
    // ---------------------------------------------------------

    const bookedTechnicianIds =
        new Set(
            conflictingAppointments.map(
                appointment =>
                    appointment.technicianId
            )
        );


    const availableTechnicians =
        activeTechnicians.filter(
            technician =>
                !bookedTechnicianIds.has(
                    technician.id
                )
        );


    if (availableTechnicians.length === 0) {
        const error = new Error(
            "No technician is available for the requested appointment slot"
        );

        error.statusCode = 409;
        throw error;
    }


    // ---------------------------------------------------------
    // 15. Assign technician
    // ---------------------------------------------------------

    const assignedTechnician =
        availableTechnicians[0];


    // ---------------------------------------------------------
    // 16. Update appointment
    // ---------------------------------------------------------

    await prisma.appointment.update({

        where: {
            id: appointmentId
        },

        data: {
            startTime: startUTC,
            endTime: endUTC,
            technicianId: assignedTechnician.id
        }
    });


    // ---------------------------------------------------------
    // 17. Fetch fresh appointment
    // ---------------------------------------------------------

    const updatedAppointment =
        await prisma.appointment.findUnique({

            where: {
                id: appointmentId
            },

            include: {
                customer: true,
                lead: true,
                technician: true
            }
        });


    return updatedAppointment;
};


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointment
};