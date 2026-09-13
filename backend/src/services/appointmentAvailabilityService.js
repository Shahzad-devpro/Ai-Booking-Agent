const { DateTime } = require("luxon");

const {
    getAvailableSlots
} = require("./availabilityService");

const {
    BUSINESS_TIMEZONE
} = require("../config/businessConfig");


const checkRequestedSlot = async ({
    preferredDate,
    preferredTime
}) => {

    if (!preferredDate || !preferredTime) {
        const error = new Error(
            "Preferred date and time are required"
        );

        error.statusCode = 400;

        throw error;
    }


    const requestedDateTime = DateTime.fromISO(
        `${preferredDate}T${preferredTime}`,
        {
            zone: BUSINESS_TIMEZONE
        }
    );


    if (!requestedDateTime.isValid) {
        const error = new Error(
            "Invalid appointment date or time"
        );

        error.statusCode = 400;

        throw error;
    }


    const slots = await getAvailableSlots(
        preferredDate
    );


    const requestedSlot = slots.find((slot) => {

        const slotStart = DateTime.fromISO(
            slot.startTime
        );

        return (
            slotStart.hour === requestedDateTime.hour &&
            slotStart.minute === requestedDateTime.minute
        );
    });


    if (!requestedSlot) {
        return {
            requestedSlot: {
                date: preferredDate,
                time: preferredTime
            },
            available: false,
            alternatives: slots
                .filter(slot => slot.available)
                .slice(0, 3)
        };
    }


    return {
        requestedSlot: {
            date: preferredDate,
            time: preferredTime
        },
        available: requestedSlot.available,
        alternatives: requestedSlot.available
            ? []
            : slots
                .filter(slot => slot.available)
                .slice(0, 3)
    };
};


module.exports = {
    checkRequestedSlot
};