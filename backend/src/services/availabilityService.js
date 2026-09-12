const { DateTime } = require("luxon");
const prisma = require("../config/database");

const {
    BUSINESS_TIMEZONE,
    BUSINESS_START_HOUR,
    BUSINESS_END_HOUR,
    SLOT_DURATION_HOURS
} = require("../config/businessConfig");

const getAvailableSlots = async (date) => {
    // Interpret the requested date as a New York calendar date
    const requestedDate = DateTime.fromISO(date, {
        zone: BUSINESS_TIMEZONE
    });

    if (!requestedDate.isValid) {
        const error = new Error("Invalid date");
        error.statusCode = 400;
        throw error;
    }

    // Sunday = closed
    if (requestedDate.weekday === 7) {
        return [];
    }

    const startOfDay = requestedDate.startOf("day").toUTC().toJSDate();
    const endOfDay = requestedDate.endOf("day").toUTC().toJSDate();

    const appointments = await prisma.appointment.findMany({
        where: {
            status: "BOOKED",
            startTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: {
            startTime: "asc"
        }
    });

    const slots = [];

    for (
        let hour = BUSINESS_START_HOUR;
        hour < BUSINESS_END_HOUR;
        hour += SLOT_DURATION_HOURS
    ) {
        const slotStart = requestedDate
            .set({
                hour,
                minute: 0,
                second: 0,
                millisecond: 0
            });

        const slotEnd = slotStart.plus({
            hours: SLOT_DURATION_HOURS
        });

        const slotStartUTC = slotStart.toUTC();
        const slotEndUTC = slotEnd.toUTC();

        const isBooked = appointments.some((appointment) => {
            return (
                appointment.startTime < slotEndUTC.toJSDate() &&
                appointment.endTime > slotStartUTC.toJSDate()
            );
        });

        slots.push({
            startTime: slotStart.toISO(),
            endTime: slotEnd.toISO(),
            available: !isBooked
        });
    }

    return slots;
};

module.exports = {
    getAvailableSlots
};