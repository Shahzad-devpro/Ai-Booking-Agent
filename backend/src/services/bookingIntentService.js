/*
|--------------------------------------------------------------------------
| BOOKING INTENT SERVICE
|--------------------------------------------------------------------------
|
| Determines whether the customer's CURRENT message confirms that
| they want to book the appointment.
|
| IMPORTANT:
| This service does NOT create appointments.
| It only detects booking intent.
|
*/

const getBookingIntent = ({
    wantsAppointment,
    preferredDate,
    preferredTime,
    customerMessage
}) => {

    // ---------------------------------------------------------
    // 1. Required information
    // ---------------------------------------------------------

    if (
        !wantsAppointment ||
        !preferredDate ||
        !preferredTime ||
        !customerMessage ||
        typeof customerMessage !== "string"
    ) {
        return {
            wantsBooking: false,
            readyForBooking: false
        };
    }


    // ---------------------------------------------------------
    // 2. Normalize current customer message
    // ---------------------------------------------------------

    const normalizedMessage =
        customerMessage
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");


    // ---------------------------------------------------------
    // 3. Confirmation patterns
    // ---------------------------------------------------------

    const confirmationPatterns = [

        /^yes$/,
        /^yes please$/,
        /^yes,? book it$/,
        /^book it$/,
        /^book it please$/,
        /^please book it$/,
        /^go ahead$/,
        /^go ahead and book it$/,
        /^confirm$/,
        /^confirmed$/,

        /^that works$/,
        /^that time works$/,
        /^that works for me$/,

        /^sounds good$/,
        /^sounds good,? book it$/,

        /^perfect$/,
        /^perfect,? book it$/,

        /^i('d| would) like to book it$/,
        /^i want to book it$/,
        /^i('d| would) like to book the appointment$/,

        /^please book the appointment$/,
        /^book the appointment$/
    ];


    // ---------------------------------------------------------
    // 4. Determine confirmation
    // ---------------------------------------------------------

    const confirmed =
        confirmationPatterns.some(
            pattern =>
                pattern.test(normalizedMessage)
        );


    // ---------------------------------------------------------
    // 5. Return intent
    // ---------------------------------------------------------

    return {
        wantsBooking: true,
        readyForBooking: confirmed
    };
};


module.exports = {
    getBookingIntent
};