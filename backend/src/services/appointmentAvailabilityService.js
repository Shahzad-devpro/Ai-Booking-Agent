const { DateTime } = require("luxon");

const {
    getAvailableSlots
} = require("./availabilityService");

const {
    BUSINESS_TIMEZONE
} = require("../config/businessConfig");


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
        .slice(0, 3);
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


    // --------------------------------------------------------
    // 5. Requested time is not a valid business slot
    // --------------------------------------------------------

    if (!requestedSlot) {

        return {

            requestedSlot: {
                date: preferredDate,
                time: preferredTime
            },

            available: false,

            alternatives:
                getClosestAvailableSlots(
                    slots,
                    requestedDateTime
                )
        };
    }


    // --------------------------------------------------------
    // 6. Requested slot is available
    // --------------------------------------------------------

    if (requestedSlot.available) {

        return {

            requestedSlot: {
                date: preferredDate,
                time: preferredTime
            },

            available: true,

            alternatives: []
        };
    }


    // --------------------------------------------------------
    // 7. Requested slot is unavailable
    // --------------------------------------------------------

    return {

        requestedSlot: {
            date: preferredDate,
            time: preferredTime
        },

        available: false,

        alternatives:
            getClosestAvailableSlots(
                slots,
                requestedDateTime
            )
    };
};


// ============================================================
// Exports
// ============================================================

module.exports = {
    checkRequestedSlot
};

