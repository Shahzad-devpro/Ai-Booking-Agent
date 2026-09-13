const { DateTime } = require("luxon");

const prisma = require("../config/database");

const {
    BUSINESS_TIMEZONE,
    BUSINESS_START_HOUR,
    BUSINESS_END_HOUR,
    SLOT_DURATION_HOURS
} = require("../config/businessConfig");


const getAvailableSlots = async (date) => {

    const requestedDate = DateTime.fromISO(date, {
        zone: BUSINESS_TIMEZONE
    });

    // -----------------------------
    // 1. Validate date
    // -----------------------------

    if (!requestedDate.isValid) {
        const error = new Error("Invalid date");
        error.statusCode = 400;
        throw error;
    }


    // -----------------------------
    // 2. Sunday unavailable
    // -----------------------------

    if (requestedDate.weekday === 7) {
        return [];
    }


    // -----------------------------
    // 3. Get active technicians
    // -----------------------------

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


    // -----------------------------
    // 4. If no technicians exist
    // -----------------------------

    if (activeTechnicians.length === 0) {
        return [];
    }


    // -----------------------------
    // 5. Get day's appointments
    // -----------------------------

    const startOfDay =
        requestedDate
            .startOf("day")
            .toUTC()
            .toJSDate();

    const endOfDay =
        requestedDate
            .endOf("day")
            .toUTC()
            .toJSDate();


    const appointments =
        await prisma.appointment.findMany({
            where: {
                status: "BOOKED",

                startTime: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },

            select: {
                technicianId: true,
                startTime: true,
                endTime: true
            }
        });


    // -----------------------------
    // 6. Generate business slots
    // -----------------------------

    const slots = [];


    for (
        let hour = BUSINESS_START_HOUR;
        hour < BUSINESS_END_HOUR;
        hour += SLOT_DURATION_HOURS
    ) {

        const slotStart =
            requestedDate.set({
                hour,
                minute: 0,
                second: 0,
                millisecond: 0
            });


        const slotEnd =
            slotStart.plus({
                hours: SLOT_DURATION_HOURS
            });


        const slotStartUTC =
            slotStart.toUTC();

        const slotEndUTC =
            slotEnd.toUTC();


        // -----------------------------
        // 7. Find technicians already
        //    booked during this slot
        // -----------------------------

        const bookedTechnicianIds =
            new Set(
                appointments
                    .filter((appointment) => {

                        return (
                            appointment.technicianId &&
                            appointment.startTime <
                                slotEndUTC.toJSDate() &&
                            appointment.endTime >
                                slotStartUTC.toJSDate()
                        );

                    })
                    .map(
                        (appointment) =>
                            appointment.technicianId
                    )
            );


        // -----------------------------
        // 8. Calculate capacity
        // -----------------------------

        const availableTechnicians =
            activeTechnicians.filter(
                (technician) =>
                    !bookedTechnicianIds.has(
                        technician.id
                    )
            );


        // -----------------------------
        // 9. Add slot
        // -----------------------------

        slots.push({

            startTime:
                slotStart.toISO(),

            endTime:
                slotEnd.toISO(),

            available:
                availableTechnicians.length > 0,

            availableTechnicianCount:
                availableTechnicians.length,

            availableTechnicians:
                availableTechnicians.map(
                    (technician) => ({
                        id: technician.id,
                        name: technician.name
                    })
                )
        });
    }


    return slots;
};


module.exports = {
    getAvailableSlots
};