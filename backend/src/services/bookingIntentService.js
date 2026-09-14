
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
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, " ");


    // ---------------------------------------------------------
    // 3. Natural-language confirmation patterns
    // ---------------------------------------------------------

    const confirmationPatterns = [

        // Direct confirmation
        /^yes$/,
        /^yes please$/,
        /^yeah$/,
        /^yeah please$/,
        /^yep$/,
        /^yup$/,
        /^sure$/,
        /^sure thing$/,
        /^okay$/,
        /^ok$/,
        /^alright$/,
        /^absolutely$/,
        /^definitely$/,

        // Direct booking requests
        /\bbook it\b/,
        /\bbook this\b/,
        /\bbook that\b/,
        /\bbook the appointment\b/,
        /\bplease book\b/,
        /\bplease schedule\b/,
        /\bschedule it\b/,
        /\bschedule this\b/,
        /\bschedule that\b/,
        /\bschedule the appointment\b/,
        /\bbook me\b/,
        /\bschedule me\b/,

        // Go ahead / proceed
        /\bgo ahead\b/,
        /\bgo ahead and book\b/,
        /\bgo ahead and schedule\b/,
        /\blet's do it\b/,
        /\blets do it\b/,
        /\blet's go with\b/,
        /\blets go with\b/,

        // Customer accepts proposed time/slot
        /\bthat works\b/,
        /\bthat works for me\b/,
        /\bthat time works\b/,
        /\bthat time works for me\b/,
        /\bthat time is good\b/,
        /\bthat time is good for me\b/,
        /\bthat time is fine\b/,
        /\bthat time is fine for me\b/,
        /\bthat slot works\b/,
        /\bthat slot works for me\b/,
        /\bthat slot is good\b/,
        /\bthat slot is good for me\b/,
        /\bthat slot is fine\b/,
        /\bthat slot is fine for me\b/,

        // General positive confirmation
        /\bsounds good\b/,
        /\bsounds great\b/,
        /\bthat sounds good\b/,
        /\bthat sounds great\b/,
        /\bperfect\b/,
        /\bthat's perfect\b/,
        /\bthats perfect\b/,
        /\bexcellent\b/,
        /\bworks for me\b/,
        /\bi'm good with that\b/,
        /\bim good with that\b/,
        /\bi'm fine with that\b/,
        /\bim fine with that\b/,

        // Explicit desire to book
        /\bi'd like to book\b/,
        /\bi would like to book\b/,
        /\bi want to book\b/,
        /\bi'd like to schedule\b/,
        /\bi would like to schedule\b/,
        /\bi want to schedule\b/,
        /\bi'd like the appointment\b/,
        /\bi would like the appointment\b/,

        // Customer accepts the slot conversationally
        /\bi'll take that\b/,
        /\bi will take that\b/,
        /\bi'll take the slot\b/,
        /\bi will take the slot\b/,
        /\bi'll take that slot\b/,
        /\bi will take that slot\b/,
        /\bi'll go with that\b/,
        /\bi will go with that\b/,
        /\bi'll go with that time\b/,
        /\bi will go with that time\b/,
        /\bput me down for that\b/,
        /\bput me down for that time\b/,

        // Confirmation
        /\bconfirm\b/,
        /\bconfirmed\b/,
        /\bconfirm the appointment\b/,
        /\bappointment confirmed\b/,
        /\bmake the appointment\b/
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

