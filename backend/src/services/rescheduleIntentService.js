 /*
|--------------------------------------------------------------------------
| RESCHEDULE INTENT SERVICE
|--------------------------------------------------------------------------
|
| Determines whether the customer is:
|
| 1. Directly asking to reschedule an appointment
|
| OR
|
| 2. Selecting an alternative time previously offered by the
|    AI receptionist.
|
| IMPORTANT:
| This service does NOT reschedule appointments.
| It only detects rescheduling intent.
|
*/

const getRescheduleIntent = ({
    customerMessage,
    conversationMessages = []
}) => {

    if (
        !customerMessage ||
        typeof customerMessage !== "string"
    ) {
        return {
            wantsReschedule: false
        };
    }

    const normalizedMessage =
        customerMessage
            .trim()
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, " ");


    // ========================================================
    // 1. DIRECT RESCHEDULE INTENT
    // ========================================================

    const directReschedulePatterns = [

        /\breschedule\b/,
        /\brescheduling\b/,
        /\brescheduled\b/,

        /\bmove my appointment\b/,
        /\bmove the appointment\b/,
        /\bmove appointment\b/,

        /\bmove my booking\b/,
        /\bmove the booking\b/,
        /\bmove booking\b/,

        /\bshift my appointment\b/,
        /\bshift the appointment\b/,
        /\bshift appointment\b/,

        /\bshift my booking\b/,
        /\bshift the booking\b/,
        /\bshift booking\b/,

        /\bpush my appointment\b/,
        /\bpush the appointment\b/,

        /\bchange my appointment\b/,
        /\bchange the appointment\b/,
        /\bchange appointment\b/,

        /\bchange my booking\b/,
        /\bchange the booking\b/,
        /\bchange booking\b/,

        /\bswitch my appointment\b/,
        /\bswitch the appointment\b/,
        /\bswitch appointment\b/,

        /\bswitch my booking\b/,
        /\bswitch the booking\b/,
        /\bswitch booking\b/
    ];

    const hasDirectRescheduleIntent =
        directReschedulePatterns.some(
            pattern =>
                pattern.test(normalizedMessage)
        );


    // ========================================================
    // 2. NATURAL LANGUAGE RESCHEDULE INTENT
    // ========================================================

    const naturalLanguagePatterns = [

        /\bcan i move\b/,
        /\bcan we move\b/,
        /\bcould i move\b/,
        /\bcould we move\b/,

        /\bcan i change\b/,
        /\bcan we change\b/,
        /\bcould i change\b/,
        /\bcould we change\b/,

        /\bi need to move\b/,
        /\bi need to change\b/,

        /\bi want to move\b/,
        /\bi want to change\b/,

        /\bi'd like to move\b/,
        /\bi'd like to change\b/,

        /\bi would like to move\b/,
        /\bi would like to change\b/,

        /\bi need a different time\b/,
        /\bi want a different time\b/,
        /\bi'd like a different time\b/,

        /\bi need a different date\b/,
        /\bi want a different date\b/,
        /\bi'd like a different date\b/
    ];

    const hasNaturalLanguageIntent =
        naturalLanguagePatterns.some(
            pattern =>
                pattern.test(normalizedMessage)
        );


    // ========================================================
    // 3. REFERENCE-BASED RESCHEDULE
    // ========================================================

    const referencePatterns = [

        /\bmove it\b/,
        /\bmove it to\b/,

        /\bchange it\b/,
        /\bchange it to\b/,

        /\bshift it\b/,
        /\bshift it to\b/,

        /\bpush it\b/,
        /\bpush it to\b/,

        /\bmove that\b/,
        /\bmove that to\b/,

        /\bchange that\b/,
        /\bchange that to\b/
    ];

    const hasReferenceIntent =
        referencePatterns.some(
            pattern =>
                pattern.test(normalizedMessage)
        );


    // ========================================================
    // 4. FIND RELEVANT PREVIOUS AVAILABILITY MESSAGE
    // ========================================================
    //
    // IMPORTANT:
    // Do NOT only inspect the immediately previous assistant
    // message.
    //
    // The conversation may contain:
    //
    // Assistant:
    // "10 AM is unavailable. 11 AM is available."
    //
    // Assistant:
    // "I'll confirm that..."
    //
    // Customer:
    // "11 AM works."
    //
    // Therefore we scan backwards and find the latest
    // assistant message that actually contains availability
    // context.
    //
    // ========================================================

    let previousAvailabilityMessage = "";

    if (
        Array.isArray(conversationMessages)
    ) {

        for (
            let i = conversationMessages.length - 1;
            i >= 0;
            i--
        ) {

            const previousMessage =
                conversationMessages[i];

            if (
                !previousMessage ||
                previousMessage.role !== "ASSISTANT" ||
                typeof previousMessage.content !== "string"
            ) {
                continue;
            }

            const assistantContent =
                previousMessage.content
                    .trim()
                    .toLowerCase()
                    .replace(/[’‘]/g, "'")
                    .replace(/\s+/g, " ");


            const indicatesUnavailable =
                /\bunavailable\b/.test(
                    assistantContent
                ) ||
                /\bnot available\b/.test(
                    assistantContent
                ) ||
                /\bfully booked\b/.test(
                    assistantContent
                ) ||
                /\bfully occupied\b/.test(
                    assistantContent
                );


            const indicatesAlternatives =
                /\bavailable\b/.test(
                    assistantContent
                ) ||
                /\bopen times?\b/.test(
                    assistantContent
                ) ||
                /\balternative\b/.test(
                    assistantContent
                ) ||
                /\bother times?\b/.test(
                    assistantContent
                );


            if (
                indicatesUnavailable &&
                indicatesAlternatives
            ) {

                previousAvailabilityMessage =
                    assistantContent;

                break;

            }
        }
    }


    // ========================================================
    // 5. CHECK WHETHER CUSTOMER SELECTED A TIME/DATE
    // ========================================================

    const hasTimeReference =
        /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/.test(
            normalizedMessage
        ) ||
        /\b\d{1,2}:\d{2}\b/.test(
            normalizedMessage
        ) ||
        /\bnoon\b/.test(
            normalizedMessage
        ) ||
        /\bmidday\b/.test(
            normalizedMessage
        );


    const hasDateReference =
        /\btoday\b/.test(
            normalizedMessage
        ) ||
        /\btomorrow\b/.test(
            normalizedMessage
        ) ||
        /\bnext week\b/.test(
            normalizedMessage
        ) ||
        /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/.test(
            normalizedMessage
        ) ||
        /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/.test(
            normalizedMessage
        );


    const selectionPatterns = [

        /\bworks for me\b/,
        /\bworks for us\b/,

        /\bthat works\b/,
        /\bthat works for me\b/,
        /\bthat time works\b/,

        /\bthat's fine\b/,
        /\bthat is fine\b/,

        /\bthat's good\b/,
        /\bthat is good\b/,

        /\bthat's perfect\b/,
        /\bthat is perfect\b/,

        /\bperfect\b/,
        /\bsounds good\b/,
        /\bsounds great\b/,

        /\bi'll take\b/,
        /\bi will take\b/,

        /\bi'd take\b/,
        /\bi would take\b/,

        /\bi'll go with\b/,
        /\bi will go with\b/,

        /\bbook that\b/,
        /\bbook it\b/,

        /\bthat time\b/,
        /\bthat slot\b/
    ];

    const hasSelectionLanguage =
        selectionPatterns.some(
            pattern =>
                pattern.test(normalizedMessage)
        );


    // ========================================================
    // 6. ALTERNATIVE SELECTION INTENT
    // ========================================================

    const hasAlternativeSelectionIntent =
        previousAvailabilityMessage.length > 0 &&
        (
            hasTimeReference ||
            hasDateReference ||
            hasSelectionLanguage
        );


    // ========================================================
    // 7. FINAL RESULT
    // ========================================================

    const wantsReschedule =
        hasDirectRescheduleIntent ||
        hasNaturalLanguageIntent ||
        hasReferenceIntent ||
        hasAlternativeSelectionIntent;


    return {
        wantsReschedule
    };
};


module.exports = {
    getRescheduleIntent
};