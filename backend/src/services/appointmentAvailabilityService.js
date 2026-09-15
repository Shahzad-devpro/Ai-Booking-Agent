const { DateTime } = require("luxon");

const {
    getAvailableSlots
} = require("./availabilityService");

const {
    BUSINESS_TIMEZONE
} = require("../config/businessConfig");


// ============================================================
// Sanitize slot for customer-facing response
// ============================================================

const sanitizeSlot = (slot) => {

    return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: slot.available
    };
};


// ============================================================
// Get closest available appointment slots
// ============================================================

const getClosestAvailableSlots = (
    slots,
    requestedDateTime
) => {

    return slots
        .filter((slot) => slot.available)
        .sort((a, b) => {

            const aTime =
                DateTime
                    .fromISO(a.startTime, {
                        setZone: true
                    })
                    .setZone(BUSINESS_TIMEZONE);


            const bTime =
                DateTime
                    .fromISO(b.startTime, {
                        setZone: true
                    })
                    .setZone(BUSINESS_TIMEZONE);


            const aDifference = Math.abs(
                aTime.diff(
                    requestedDateTime,
                    "minutes"
                ).minutes
            );


            const bDifference = Math.abs(
                bTime.diff(
                    requestedDateTime,
                    "minutes"
                ).minutes
            );


            return aDifference - bDifference;
        })
        .slice(0, 3)
        .map(sanitizeSlot);
};


// ============================================================
// Get future available slots
// ============================================================

const getFutureAvailableSlots = async ({
    requestedDateTime
}) => {

    const futureSlots = [];


    let searchDate =
        requestedDateTime
            .startOf("day")
            .plus({
                days: 1
            });


    // --------------------------------------------------------
    // Search up to 7 calendar days ahead
    // --------------------------------------------------------

    for (let day = 0; day < 7; day++) {

        // ----------------------------------------------------
        // Skip Sunday
        // ----------------------------------------------------

        if (searchDate.weekday !== 7) {

            const dateString =
                searchDate.toFormat("yyyy-MM-dd");


            const slots =
                await getAvailableSlots(
                    dateString
                );


            const availableSlots =
                slots.filter(
                    (slot) =>
                        slot.available
                );


            futureSlots.push(
                ...availableSlots
            );


            // ------------------------------------------------
            // Stop once enough alternatives exist
            // ------------------------------------------------

            if (futureSlots.length >= 3) {
                break;
            }
        }


        searchDate =
            searchDate.plus({
                days: 1
            });
    }


    // --------------------------------------------------------
    // Sort chronologically
    // --------------------------------------------------------

    return futureSlots
        .sort((a, b) => {

            const aTime =
                DateTime
                    .fromISO(a.startTime, {
                        setZone: true
                    })
                    .setZone(BUSINESS_TIMEZONE);


            const bTime =
                DateTime
                    .fromISO(b.startTime, {
                        setZone: true
                    })
                    .setZone(BUSINESS_TIMEZONE);


            return (
                aTime.toMillis() -
                bTime.toMillis()
            );
        })
        .slice(0, 3)
        .map(sanitizeSlot);
};


// ============================================================
// Check requested appointment slot
// ============================================================

const checkRequestedSlot = async ({
    preferredDate,
    preferredTime
}) => {

    // --------------------------------------------------------
    // 1. Validate input
    // --------------------------------------------------------

    if (!preferredDate || !preferredTime) {

        const error = new Error(
            "Preferred date and time are required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 2. Create requested DateTime
    // --------------------------------------------------------

    const requestedDateTime =
        DateTime.fromISO(
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


    // --------------------------------------------------------
    // 3. Get availability for requested date
    // --------------------------------------------------------

    const slots =
        await getAvailableSlots(
            preferredDate
        );


    // --------------------------------------------------------
    // 4. Find requested slot
    // --------------------------------------------------------

    const requestedSlot =
        slots.find((slot) => {

            const slotStart =
                DateTime
                    .fromISO(
                        slot.startTime,
                        {
                            setZone: true
                        }
                    )
                    .setZone(
                        BUSINESS_TIMEZONE
                    );


            return (
                slotStart.toFormat("yyyy-MM-dd") ===
                    preferredDate &&

                slotStart.hour ===
                    requestedDateTime.hour &&

                slotStart.minute ===
                    requestedDateTime.minute
            );
        });


    // ========================================================
    // 5. Requested slot is available
    // ========================================================

    if (
        requestedSlot &&
        requestedSlot.available
    ) {

        return {

            requestedSlot: {
                date: preferredDate,
                time: preferredTime
            },

            available: true,

            alternatives: []
        };
    }


    // ========================================================
    // 6. Find same-day alternatives
    // ========================================================

    const sameDayAlternatives =
        getClosestAvailableSlots(
            slots,
            requestedDateTime
        );


    // --------------------------------------------------------
    // Return same-day alternatives when available
    // --------------------------------------------------------

    if (sameDayAlternatives.length > 0) {

        return {

            requestedSlot: {
                date: preferredDate,
                time: preferredTime
            },

            available: false,

            alternatives:
                sameDayAlternatives
        };
    }


    // ========================================================
    // 7. No same-day availability
    //
    // Search future business days.
    // ========================================================

    const futureAlternatives =
        await getFutureAvailableSlots({
            requestedDateTime
        });


    // ========================================================
    // 8. Return future alternatives
    // ========================================================

    return {

        requestedSlot: {
            date: preferredDate,
            time: preferredTime
        },

        available: false,

        alternatives:
            futureAlternatives
    };
};


// ============================================================
// Exports
// ============================================================

module.exports = {
    checkRequestedSlot
};