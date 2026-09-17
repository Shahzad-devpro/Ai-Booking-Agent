const BUSINESS_TIMEZONE =
    "America/New_York";


// ============================================================
// NEW YORK WALL-CLOCK TIME → UTC ISO
// ============================================================

const zonedWallTimeToIso = (
    date,
    time,
    timeZone = BUSINESS_TIMEZONE
) => {

    if (!date || !time) {

        throw new Error(
            "Date and time are required"
        );

    }


    const [
        year,
        month,
        day
    ] =
        date
            .split("-")
            .map(Number);


    const [
        hour,
        minute
    ] =
        time
            .split(":")
            .map(Number);


    if (
        !year ||
        !month ||
        !day ||
        Number.isNaN(hour) ||
        Number.isNaN(minute)
    ) {

        throw new Error(
            "Invalid date or time"
        );

    }


    /*
     * First create a UTC guess using the same wall-clock
     * numbers supplied by the user.
     */
    const utcGuess =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                0,
                0
            )
        );


    const formatter =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone,

                year: "numeric",
                month: "2-digit",
                day: "2-digit",

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",

                hourCycle: "h23"
            }
        );


    const parts =
        formatter.formatToParts(
            utcGuess
        );


    const values = {};


    parts.forEach(
        ({
            type,
            value
        }) => {

            if (
                type !== "literal"
            ) {

                values[type] =
                    value;

            }

        }
    );


    const zonedAsUtc =
        Date.UTC(
            Number(values.year),
            Number(values.month) - 1,
            Number(values.day),
            Number(values.hour),
            Number(values.minute),
            Number(values.second)
        );


    const offset =
        zonedAsUtc -
        utcGuess.getTime();


    return new Date(
        utcGuess.getTime() -
        offset
    ).toISOString();
};


// ============================================================
// BUILD ONE-HOUR BUSINESS SLOT
// ============================================================

const buildBusinessSlot =
    (
        date,
        startTime
    ) => {

        const [
            hour,
            minute
        ] =
            startTime
                .split(":")
                .map(Number);


        if (
            Number.isNaN(hour) ||
            Number.isNaN(minute)
        ) {

            throw new Error(
                "Invalid appointment time"
            );

        }


        const startTimeIso =
            zonedWallTimeToIso(
                date,
                startTime
            );


        const endHour =
            hour + 1;


        if (endHour > 17) {

            throw new Error(
                "Appointment must finish by 5:00 PM"
            );

        }


        const endTime =
            `${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;


        const endTimeIso =
            zonedWallTimeToIso(
                date,
                endTime
            );


        return {
            startTime:
                startTimeIso,

            endTime:
                endTimeIso
        };
    };


// ============================================================
// FORMAT ISO DATE FOR NEW YORK
// ============================================================

const formatDateForInput =
    isoString => {

        if (!isoString) {
            return "";
        }


        return new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(
            new Date(isoString)
        );
    };


// ============================================================
// FORMAT ISO TIME FOR NEW YORK
// ============================================================

const formatTimeForInput =
    isoString => {

        if (!isoString) {
            return "";
        }


        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                hour: "2-digit",
                minute: "2-digit",

                hourCycle: "h23"
            }
        ).format(
            new Date(isoString)
        );
    };


// ============================================================
// DISPLAY DATE
// ============================================================

const formatBusinessDate =
    isoString => {

        if (!isoString) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                month: "short",
                day: "numeric",
                year: "numeric"
            }
        ).format(
            new Date(isoString)
        );
    };


// ============================================================
// DISPLAY TIME
// ============================================================

const formatBusinessTime =
    isoString => {

        if (!isoString) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                hour: "numeric",
                minute: "2-digit"
            }
        ).format(
            new Date(isoString)
        );
    };


export {
    BUSINESS_TIMEZONE,
    zonedWallTimeToIso,
    buildBusinessSlot,
    formatDateForInput,
    formatTimeForInput,
    formatBusinessDate,
    formatBusinessTime
};