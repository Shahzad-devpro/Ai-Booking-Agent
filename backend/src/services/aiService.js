const Groq = require("groq-sdk");

const { DateTime } = require("luxon");

const {
    BUSINESS_TIMEZONE
} = require("../config/businessConfig");


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// ============================================================
// GENERATE AI RESPONSE
// ============================================================

const generateAIResponse = async (conversationMessages) => {

    // --------------------------------------------------------
    // 1. Validate conversation messages
    // --------------------------------------------------------

    if (
        !conversationMessages ||
        !Array.isArray(conversationMessages) ||
        conversationMessages.length === 0
    ) {

        const error = new Error(
            "Conversation messages are required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 2. Build AI messages
    // --------------------------------------------------------

    const messages = [

        {
            role: "system",

            content: `
You are an AI receptionist for a fictional HVAC company.

Your job is to help customers with:

- HVAC service questions
- AC problems
- Heating problems
- Service requests
- Appointment requests

Be professional, friendly, concise, and helpful.

Important rules:

1. Never invent prices.

2. Never diagnose dangerous situations.

3. Never claim that an appointment is available unless the backend
   has confirmed it.

4. If a customer describes an emergency, prioritize safety.

5. Ask relevant follow-up questions when information is missing.

6. If the customer requests an appointment, acknowledge the request
   but do not claim that the requested time is available.

7. Do not say that you personally checked the schedule.
   Appointment availability is handled by the backend.

8. Do not invent appointment times.

9. Do not invent customer information.

10. Keep responses concise and natural.

11. If an appointment request contains a date and time,
    acknowledge the requested date and time without confirming
    availability.
`
        },

        ...conversationMessages.map((message) => ({

            role:
                message.role.toLowerCase(),

            content:
                message.content

        }))

    ];


    // --------------------------------------------------------
    // 3. Call Groq
    // --------------------------------------------------------

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages,

            temperature: 0.3,

            max_completion_tokens: 1024,

            reasoning_effort: "low",

            reasoning_format: "hidden"

        });


    // --------------------------------------------------------
    // 4. Extract response
    // --------------------------------------------------------

    const response =
        completion
            ?.choices?.[0]
            ?.message
            ?.content;


    // --------------------------------------------------------
    // 5. Validate response
    // --------------------------------------------------------

    if (
        !response ||
        typeof response !== "string" ||
        response.trim().length === 0
    ) {

        console.log(
            "RAW GROQ GENERATION RESPONSE:"
        );

        console.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        const error = new Error(
            "AI returned an empty response"
        );

        error.statusCode = 502;

        throw error;
    }


    return response.trim();
};


// ============================================================
// EXTRACT STRUCTURED LEAD DATA
// ============================================================

const extractLeadData = async (conversationMessages) => {

    // --------------------------------------------------------
    // 1. Validate conversation messages
    // --------------------------------------------------------

    if (
        !conversationMessages ||
        !Array.isArray(conversationMessages) ||
        conversationMessages.length === 0
    ) {

        const error = new Error(
            "Conversation messages are required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 2. Current date in business timezone
    // --------------------------------------------------------

    const currentBusinessDate =
        DateTime.now()
            .setZone(BUSINESS_TIMEZONE)
            .toISODate();


    // --------------------------------------------------------
    // 3. Build extraction prompt
    // --------------------------------------------------------

    const messages = [

        {
            role: "system",

            content: `
You extract structured lead information from an HVAC customer conversation.

CURRENT BUSINESS DATE:
${currentBusinessDate}

BUSINESS TIMEZONE:
${BUSINESS_TIMEZONE}

Return ONLY valid JSON.

Use exactly this structure:

{
  "customer": {
    "name": null,
    "phone": null,
    "email": null,
    "address": null
  },
  "service": null,
  "problemDescription": null,
  "urgency": null,
  "wantsAppointment": false,
  "preferredDate": null,
  "preferredTime": null
}

Allowed service values:

- AC_REPAIR
- AC_INSTALLATION
- HEATING_REPAIR
- HEATING_INSTALLATION
- HVAC_MAINTENANCE
- OTHER

Allowed urgency values:

- LOW
- NORMAL
- HIGH
- EMERGENCY


DATE AND TIME RULES:

1. preferredDate must use YYYY-MM-DD format.

2. preferredTime must use 24-hour HH:mm format.

3. Use CURRENT BUSINESS DATE as the reference date.

4. If the customer provides a month and day without a year,
   determine the appropriate year using CURRENT BUSINESS DATE.

5. Never use a historical year unless the customer explicitly
   provides that year.

6. If the customer says "today", use CURRENT BUSINESS DATE.

7. If the customer says "tomorrow", calculate tomorrow relative
   to CURRENT BUSINESS DATE.

8. If the customer says "yesterday", calculate yesterday relative
   to CURRENT BUSINESS DATE.

9. If the customer says "next Monday", "next Tuesday", etc.,
   determine the correct upcoming weekday relative to
   CURRENT BUSINESS DATE.

10. If the customer provides an explicit year, use that year.

11. If the date is unclear, return null.

12. If the time is unclear, return null.


GENERAL EXTRACTION RULES:

13. Only extract information explicitly provided or clearly stated
    by the customer.

14. Never invent missing customer information.

15. Use null for unknown fields.

16. wantsAppointment must be true only when the customer clearly
    wants to schedule an appointment.

17. preferredDate must be null when the customer has not provided
    a usable appointment date.

18. preferredTime must be null when the customer has not provided
    a usable appointment time.

19. problemDescription should summarize the customer's actual
    HVAC problem.

20. Determine urgency from the conversation, but do not exaggerate.

21. If the customer describes an immediate dangerous situation,
    use EMERGENCY.

22. Return JSON only.

23. Do not include markdown.

24. Do not include explanations outside the JSON.
`
        },

        ...conversationMessages.map((message) => ({

            role:
                message.role.toLowerCase(),

            content:
                message.content

        }))

    ];


    // --------------------------------------------------------
    // 4. Call Groq
    // --------------------------------------------------------

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages,

            temperature: 0,

            max_completion_tokens: 1024,

            reasoning_effort: "low",

            reasoning_format: "hidden",

            response_format: {
                type: "json_object"
            }

        });


    // --------------------------------------------------------
    // 5. Extract response
    // --------------------------------------------------------

    const response =
        completion
            ?.choices?.[0]
            ?.message
            ?.content;


    // --------------------------------------------------------
    // 6. Debug information
    // --------------------------------------------------------

    console.log(
        "CURRENT BUSINESS DATE:",
        currentBusinessDate
    );

    console.log(
        "RAW GROQ EXTRACTION RESPONSE:"
    );

    console.log(
        JSON.stringify(
            completion,
            null,
            2
        )
    );


    // --------------------------------------------------------
    // 7. Validate response
    // --------------------------------------------------------

    if (
        !response ||
        typeof response !== "string" ||
        response.trim().length === 0
    ) {

        const error = new Error(
            "AI returned an empty extraction response"
        );

        error.statusCode = 502;

        throw error;
    }


    // --------------------------------------------------------
    // 8. Parse JSON
    // --------------------------------------------------------

    try {

        return JSON.parse(
            response.trim()
        );

    } catch (error) {

        console.log(
            "INVALID AI JSON:"
        );

        console.log(
            response
        );


        const parseError = new Error(
            "AI returned invalid JSON"
        );

        parseError.statusCode = 502;

        throw parseError;
    }
};


// ============================================================
// GENERATE AVAILABILITY-AWARE AI RESPONSE
// ============================================================

const generateAvailabilityResponse = async ({
    conversationMessages,
    availability,
    preferredDate,
    preferredTime
}) => {

    // --------------------------------------------------------
    // 1. Validate conversation messages
    // --------------------------------------------------------

    if (
        !conversationMessages ||
        !Array.isArray(conversationMessages) ||
        conversationMessages.length === 0
    ) {

        const error = new Error(
            "Conversation messages are required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 2. Validate availability
    // --------------------------------------------------------

    if (
        !availability ||
        typeof availability.available !== "boolean"
    ) {

        const error = new Error(
            "Valid appointment availability data is required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 3. Validate appointment date/time
    // --------------------------------------------------------

    if (
        !preferredDate ||
        typeof preferredDate !== "string" ||
        !preferredTime ||
        typeof preferredTime !== "string"
    ) {

        const error = new Error(
            "Appointment date and time are required"
        );

        error.statusCode = 400;

        throw error;
    }


    // --------------------------------------------------------
    // 4. Build trusted backend availability context
    // --------------------------------------------------------

    const availabilityContext =
        availability.available

            ? {

                status: "AVAILABLE",

                requestedDate:
                    preferredDate,

                requestedTime:
                    preferredTime

            }

            : {

                status: "UNAVAILABLE",

                requestedDate:
                    preferredDate,

                requestedTime:
                    preferredTime,

                alternatives:
                    Array.isArray(
                        availability.alternatives
                    )
                        ? availability.alternatives
                        : []

            };


    // --------------------------------------------------------
    // 5. Build AI messages
    // --------------------------------------------------------

    const messages = [

        {

            role: "system",

            content: `
You are the AI receptionist for a fictional HVAC company.

Your job is to communicate appointment availability to the customer.

IMPORTANT RULES:

1. The backend availability data below is the ONLY source of truth
   for appointment availability.

2. NEVER invent appointment availability.

3. If the requested appointment is AVAILABLE:

   - Clearly tell the customer that the requested time is available.
   - Ask the customer to confirm that they want to book it.
   - Do NOT claim that the appointment has already been booked.

4. If the requested appointment is NOT AVAILABLE:

   - Clearly tell the customer that their requested time is unavailable.
   - Offer available alternative times from the backend data.
   - NEVER invent alternative times.

5. NEVER claim that an appointment has been booked unless the
   backend explicitly confirms that the booking was completed.

6. NEVER say that you personally checked the scheduling system.

7. NEVER say that you are forwarding the request to a scheduling team.

8. Never invent prices.

9. Never invent customer information.

10. Never diagnose HVAC problems.

11. If the customer describes a dangerous emergency,
    prioritize safety.

12. Keep the response concise, professional, and natural.

13. Use the customer's conversation context when appropriate.

14. If the requested slot is available, the customer must still
    confirm before the system books the appointment.

BACKEND AVAILABILITY DATA:

${JSON.stringify(
    availabilityContext,
    null,
    2
)}
`
        },

        ...conversationMessages.map((message) => ({

            role:
                message.role === "USER"
                    ? "user"
                    : "assistant",

            content:
                message.content

        }))

    ];


    // --------------------------------------------------------
    // 6. Call Groq
    // --------------------------------------------------------

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages,

            temperature: 0.3,

            max_completion_tokens: 512,

            reasoning_effort: "low",

            reasoning_format: "hidden"

        });


    // --------------------------------------------------------
    // 7. Extract response
    // --------------------------------------------------------

    const response =
        completion
            ?.choices?.[0]
            ?.message
            ?.content
            ?.trim();


    // --------------------------------------------------------
    // 8. Validate response
    // --------------------------------------------------------

    if (
        !response ||
        typeof response !== "string" ||
        response.length === 0
    ) {

        console.log(
            "RAW GROQ AVAILABILITY RESPONSE:"
        );

        console.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        const error = new Error(
            "AI returned an empty availability response"
        );

        error.statusCode = 502;

        throw error;
    }


    return response;
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    generateAIResponse,
    extractLeadData,
    generateAvailabilityResponse
};

