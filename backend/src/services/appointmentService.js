const { DateTime } = require("luxon");

const prisma =
    require("../config/database");

const {
    BUSINESS_TIMEZONE,
    BUSINESS_START_HOUR,
    BUSINESS_END_HOUR,
    SLOT_DURATION_HOURS
} = require("../config/businessConfig");


// ============================================================
// HELPERS
// ============================================================

const createError = (
    message,
    statusCode = 400
) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};


const parseBusinessDateTime = (
    value
) => {
    const parsed =
        DateTime
            .fromISO(value, {
                setZone: true
            })
            .setZone(
                BUSINESS_TIMEZONE
            );

    if (!parsed.isValid) {
        throw createError(
            "Invalid appointment time",
            400
        );
    }

    return parsed;
};


const validateBusinessTime = ({
    start,
    end,
    pastMessage
}) => {

    const now =
        DateTime
            .now()
            .setZone(
                BUSINESS_TIMEZONE
            );

    if (start <= now) {
        throw createError(
            pastMessage,
            400
        );
    }


    if (start.weekday === 7) {
        throw createError(
            "Appointments are not available on Sunday",
            400
        );
    }


    if (
        end.toMillis() <=
        start.toMillis()
    ) {
        throw createError(
            "Appointment end time must be after start time",
            400
        );
    }


    const durationInMinutes =
        end.diff(
            start,
            "minutes"
        ).minutes;

    const requiredDuration =
        SLOT_DURATION_HOURS * 60;

    if (
        durationInMinutes !==
        requiredDuration
    ) {
        throw createError(
            `Appointment must be exactly ${SLOT_DURATION_HOURS} hour`,
            400
        );
    }


    if (
        start.minute !== 0 ||
        start.second !== 0 ||
        start.millisecond !== 0
    ) {
        throw createError(
            "Appointments must start on a full-hour slot",
            400
        );
    }


    const businessStart =
        start
            .startOf("day")
            .set({
                hour:
                    BUSINESS_START_HOUR,
                minute: 0,
                second: 0,
                millisecond: 0
            });


    const businessEnd =
        start
            .startOf("day")
            .set({
                hour:
                    BUSINESS_END_HOUR,
                minute: 0,
                second: 0,
                millisecond: 0
            });


    if (
        start.toMillis() <
            businessStart.toMillis() ||
        end.toMillis() >
            businessEnd.toMillis()
    ) {
        throw createError(
            `Appointment must be within business hours: ${BUSINESS_START_HOUR}:00 AM - ${BUSINESS_END_HOUR}:00 PM`,
            400
        );
    }
};


// ============================================================
// FIND AVAILABLE TECHNICIAN
// ============================================================

const findAvailableTechnician =
    async ({
        startUTC,
        endUTC,
        excludeAppointmentId = null,
        tx = prisma
    }) => {

        const technicians =
            await tx.technician.findMany({
                where: {
                    active: true
                },
                select: {
                    id: true,
                    name: true
                },
                orderBy: {
                    name: "asc"
                }
            });


        if (
            technicians.length === 0
        ) {
            throw createError(
                "No technicians are currently available",
                409
            );
        }


        const conflictWhere = {
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
        };


        if (
            excludeAppointmentId
        ) {
            conflictWhere.id = {
                not:
                    excludeAppointmentId
            };
        }


        const conflicts =
            await tx.appointment.findMany({
                where: conflictWhere,
                select: {
                    technicianId: true
                }
            });


        const bookedTechnicianIds =
            new Set(
                conflicts.map(
                    appointment =>
                        appointment.technicianId
                )
            );


        return (
            technicians.find(
                technician =>
                    !bookedTechnicianIds.has(
                        technician.id
                    )
            ) || null
        );
};


// ============================================================
// CREATE APPOINTMENT
// ============================================================

const createAppointment =
    async ({
        leadId,
        customerId,
        startTime,
        endTime,
        notes
    }) => {

        if (
            !leadId ||
            !customerId ||
            !startTime ||
            !endTime
        ) {
            throw createError(
                "leadId, customerId, startTime and endTime are required",
                400
            );
        }


        const start =
            parseBusinessDateTime(
                startTime
            );

        const end =
            parseBusinessDateTime(
                endTime
            );


        validateBusinessTime({
            start,
            end,
            pastMessage:
                "Appointment cannot be booked in the past"
        });


        const startUTC =
            start
                .toUTC()
                .toJSDate();

        const endUTC =
            end
                .toUTC()
                .toJSDate();


        const lead =
            await prisma.lead.findUnique({
                where: {
                    id: leadId
                }
            });


        if (!lead) {
            throw createError(
                "Lead not found",
                404
            );
        }


        const customer =
            await prisma.customer.findUnique({
                where: {
                    id: customerId
                }
            });


        if (!customer) {
            throw createError(
                "Customer not found",
                404
            );
        }


        if (
            lead.customerId !==
            customerId
        ) {
            throw createError(
                "Lead does not belong to this customer",
                400
            );
        }


        const existingAppointment =
            await prisma.appointment.findUnique({
                where: {
                    leadId
                }
            });


        if (existingAppointment) {
            throw createError(
                "This lead already has an appointment",
                409
            );
        }


        const appointment =
            await prisma.$transaction(
                async tx => {

                    const technician =
                        await findAvailableTechnician({
                            startUTC,
                            endUTC,
                            tx
                        });


                    if (!technician) {
                        throw createError(
                            "No technician is available for this appointment slot",
                            409
                        );
                    }


                    const created =
                        await tx.appointment.create({
                            data: {
                                customerId,
                                leadId,
                                technicianId:
                                    technician.id,
                                startTime:
                                    startUTC,
                                endTime:
                                    endUTC,
                                notes:
                                    notes ||
                                    null
                            }
                        });


                    await tx.lead.update({
                        where: {
                            id: leadId
                        },
                        data: {
                            status: "BOOKED"
                        }
                    });


                    return created;
                }
            );


        return getAppointmentById(
            appointment.id
        );
};


// ============================================================
// GET ALL APPOINTMENTS
// ============================================================

const getAllAppointments =
    async ({
        search = "",
        status,
        technicianId,
        date,
        page = 1,
        limit = 10
    }) => {

        const safePage =
            Math.max(
                1,
                Number(page) || 1
            );

        const safeLimit =
            Math.min(
                50,
                Math.max(
                    1,
                    Number(limit) || 10
                )
            );


        const skip =
            (safePage - 1) *
            safeLimit;


        const where = {};


        if (status) {
            where.status =
                status;
        }


        if (technicianId) {
            where.technicianId =
                technicianId;
        }


        // --------------------------------------------------------
        // New York calendar-day filtering
        // --------------------------------------------------------

        if (date) {

            const startOfDay =
                DateTime.fromISO(
                    `${date}T00:00:00`,
                    {
                        zone:
                            BUSINESS_TIMEZONE
                    }
                );


            if (
                !startOfDay.isValid
            ) {
                throw createError(
                    "Invalid appointment date",
                    400
                );
            }


            const endOfDay =
                startOfDay.plus({
                    days: 1
                });


            where.startTime = {
                gte:
                    startOfDay
                        .toUTC()
                        .toJSDate(),

                lt:
                    endOfDay
                        .toUTC()
                        .toJSDate()
            };
        }


        // --------------------------------------------------------
        // Search
        // --------------------------------------------------------

        const normalizedSearch =
            typeof search === "string"
                ? search.trim()
                : "";


        if (normalizedSearch) {

            where.OR = [
                {
                    customer: {
                        name: {
                            contains:
                                normalizedSearch,
                            mode:
                                "insensitive"
                        }
                    }
                },

                {
                    customer: {
                        phone: {
                            contains:
                                normalizedSearch
                        }
                    }
                },

                {
                    customer: {
                        email: {
                            contains:
                                normalizedSearch,
                            mode:
                                "insensitive"
                        }
                    }
                },

                {
                    lead: {
                        service: {
                            contains:
                                normalizedSearch,
                            mode:
                                "insensitive"
                        }
                    }
                },

                {
                    lead: {
                        problemDescription: {
                            contains:
                                normalizedSearch,
                            mode:
                                "insensitive"
                        }
                    }
                },

                {
                    technician: {
                        name: {
                            contains:
                                normalizedSearch,
                            mode:
                                "insensitive"
                        }
                    }
                }
            ];
        }


        const [
            appointments,
            total
        ] = await Promise.all([
            prisma.appointment.findMany({
                where,

                select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                    notes: true,
                    createdAt: true,
                    updatedAt: true,

                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            email: true,
                            address: true
                        }
                    },

                    lead: {
                        select: {
                            id: true,
                            service: true,
                            problemDescription:
                                true,
                            urgency: true,
                            status: true
                        }
                    },

                    technician: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            email: true
                        }
                    }
                },

                // Newest bookings first.
                // ID is included as a deterministic tie-breaker.
                orderBy: [
                    {
                        createdAt:
                            "desc"
                    },
                    {
                        id:
                            "desc"
                    }
                ],

                skip,
                take: safeLimit
            }),

            prisma.appointment.count({
                where
            })
        ]);


        return {
            appointments,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages:
                Math.ceil(
                    total /
                    safeLimit
                )
        };
};


// ============================================================
// GET APPOINTMENT BY ID
// ============================================================

const getAppointmentById =
    async id => {

        if (!id) {
            throw createError(
                "Appointment ID is required",
                400
            );
        }


        const appointment =
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


        if (!appointment) {
            throw createError(
                "Appointment not found",
                404
            );
        }


        return appointment;
};


// ============================================================
// GET BOOKED APPOINTMENT BY LEAD
// ============================================================

const getBookedAppointmentByLeadId =
    async leadId => {

        if (!leadId) {
            throw createError(
                "Lead ID is required",
                400
            );
        }


        return prisma.appointment.findFirst({
            where: {
                leadId,
                status: "BOOKED"
            },

            include: {
                customer: true,
                lead: true,
                technician: true
            }
        });
};


// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment =
    async id => {

        if (!id) {
            throw createError(
                "Appointment ID is required",
                400
            );
        }


        const appointment =
            await prisma.appointment.findUnique({
                where: {
                    id
                }
            });


        if (!appointment) {
            throw createError(
                "Appointment not found",
                404
            );
        }


        if (
            appointment.status ===
            "CANCELLED"
        ) {
            throw createError(
                "Appointment is already cancelled",
                409
            );
        }


        if (
            appointment.status ===
            "COMPLETED"
        ) {
            throw createError(
                "Completed appointment cannot be cancelled",
                409
            );
        }


        await prisma.$transaction(
            async tx => {

                await tx.appointment.update({
                    where: {
                        id
                    },

                    data: {
                        status:
                            "CANCELLED"
                    }
                });


                await tx.lead.update({
                    where: {
                        id:
                            appointment.leadId
                    },

                    data: {
                        status:
                            "CANCELLED"
                    }
                });
            }
        );


        return getAppointmentById(
            id
        );
};


// ============================================================
// RESCHEDULE APPOINTMENT
// ============================================================

const rescheduleAppointment =
    async ({
        appointmentId,
        startTime,
        endTime
    }) => {

        if (
            !appointmentId ||
            !startTime ||
            !endTime
        ) {
            throw createError(
                "Appointment ID, startTime and endTime are required",
                400
            );
        }


        const start =
            parseBusinessDateTime(
                startTime
            );

        const end =
            parseBusinessDateTime(
                endTime
            );


        validateBusinessTime({
            start,
            end,
            pastMessage:
                "Appointment cannot be rescheduled to a past time"
        });


        const startUTC =
            start
                .toUTC()
                .toJSDate();

        const endUTC =
            end
                .toUTC()
                .toJSDate();


        const existingAppointment =
            await prisma.appointment.findUnique({
                where: {
                    id:
                        appointmentId
                }
            });


        if (!existingAppointment) {
            throw createError(
                "Appointment not found",
                404
            );
        }


        if (
            existingAppointment.status ===
            "CANCELLED"
        ) {
            throw createError(
                "Cancelled appointment cannot be rescheduled",
                409
            );
        }


        if (
            existingAppointment.status ===
            "COMPLETED"
        ) {
            throw createError(
                "Completed appointment cannot be rescheduled",
                409
            );
        }


        await prisma.$transaction(
            async tx => {

                const technician =
                    await findAvailableTechnician({
                        startUTC,
                        endUTC,
                        excludeAppointmentId:
                            appointmentId,
                        tx
                    });


                if (!technician) {
                    throw createError(
                        "No technician is available for the requested appointment slot",
                        409
                    );
                }


                await tx.appointment.update({
                    where: {
                        id:
                            appointmentId
                    },

                    data: {
                        startTime:
                            startUTC,

                        endTime:
                            endUTC,

                        technicianId:
                            technician.id
                    }
                });
            },

            {
                isolationLevel:
                    "Serializable"
            }
        );


        return getAppointmentById(
            appointmentId
        );
};

// ============================================================
// GET ACTIVE TECHNICIANS
// ===========================================================

const getActiveTechnicians =
    async () => {

        return prisma.technician.findMany({

            where: {
                active: true
            },

            select: {
                id: true,
                name: true
            },

            orderBy: {
                name: "asc"
            }

        });
    };


// ============================================================
// MANUAL TECHNICIAN ASSIGNMENT
// ============================================================

const assignTechnician =
    async ({
        appointmentId,
        technicianId
    }) => {

        if (!appointmentId) {

            const error =
                new Error(
                    "Appointment ID is required"
                );

            error.statusCode = 400;

            throw error;
        }


        if (!technicianId) {

            const error =
                new Error(
                    "Technician ID is required"
                );

            error.statusCode = 400;

            throw error;
        }


        const appointment =
            await prisma.appointment.findUnique({

                where: {
                    id: appointmentId
                }

            });


        if (!appointment) {

            const error =
                new Error(
                    "Appointment not found"
                );

            error.statusCode = 404;

            throw error;
        }


        if (
            appointment.status !==
            "BOOKED"
        ) {

            const error =
                new Error(
                    "Only booked appointments can have technicians assigned"
                );

            error.statusCode = 409;

            throw error;
        }


        const technician =
            await prisma.technician.findFirst({

                where: {
                    id: technicianId,
                    active: true
                }

            });


        if (!technician) {

            const error =
                new Error(
                    "Active technician not found"
                );

            error.statusCode = 404;

            throw error;
        }


        /*
         * Assigning the same technician again is safe.
         */
        if (
            appointment.technicianId ===
            technicianId
        ) {

            return prisma.appointment.findUnique({

                where: {
                    id: appointmentId
                },

                include: {
                    customer: true,
                    lead: true,
                    technician: true
                }

            });
        }


        /*
         * A technician cannot have another BOOKED
         * appointment overlapping this appointment.
         */
        const conflict =
            await prisma.appointment.findFirst({

                where: {

                    id: {
                        not: appointmentId
                    },

                    technicianId,

                    status: "BOOKED",

                    startTime: {
                        lt: appointment.endTime
                    },

                    endTime: {
                        gt: appointment.startTime
                    }

                }

            });


        if (conflict) {

            const error =
                new Error(
                    "This technician is already booked during this appointment time"
                );

            error.statusCode = 409;

            throw error;
        }


        const updatedAppointment =
            await prisma.appointment.update({

                where: {
                    id: appointmentId
                },

                data: {
                    technicianId
                },

                include: {
                    customer: true,
                    lead: true,
                    technician: true
                }

            });


        return updatedAppointment;
    };


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    getBookedAppointmentByLeadId,
    cancelAppointment,
    rescheduleAppointment,
    getActiveTechnicians,
    assignTechnician
};