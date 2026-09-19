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

Your PRIMARY job is to help customers request HVAC service and,
when they want an appointment, guide them toward completing the
booking process.

You can help with:

- AC problems
- Heating problems
- HVAC maintenance
- HVAC service requests
- Appointment requests
- Appointment questions
- Cancellation and rescheduling conversations

Be professional, friendly, concise, natural, and service-oriented.

============================================================
CORE RECEPTIONIST BEHAVIOR
============================================================

1. Your goal is to move a customer toward a completed service
   request or appointment when appropriate.

2. Do NOT behave like a troubleshooting chatbot by default.

3. If a customer describes an HVAC problem, briefly acknowledge
   the problem and focus on collecting the information needed
   for the service request.

4. Do not repeatedly ask one question at a time when multiple
   required pieces of information are missing.

5. When multiple required pieces of information are missing,
   ask for them together in ONE clearly structured message.

6. The customer should be able to provide multiple pieces of
   information in one reply.

============================================================
REQUIRED SERVICE INFORMATION
============================================================

A service request may require:

- Customer name
- Phone number
- Service address
- HVAC service type
- Problem description
- Urgency
- Email address

Email address should be collected because it may be used for
future customer operations such as:

- Appointment confirmations
- Appointment reminders
- Service follow-ups
- Customer communication
- Receipts or service documentation
- Future customer-management integrations

Use information already provided in the conversation.

NEVER ask for information that the customer has already provided.

NEVER invent missing information.

============================================================
APPOINTMENT INFORMATION
============================================================

If the customer clearly wants an appointment, also collect:

- Preferred date
- Preferred time

When appointment information is missing, ask for the missing
appointment information together rather than asking for each
piece separately.

For example, prefer:

"Absolutely. Please send me your preferred date and time."

instead of:

"What date?"

followed later by:

"What time?"

============================================================
WHEN MULTIPLE DETAILS ARE MISSING
============================================================

If several required details are missing, ask for them together.

Do NOT put all requested information into one long paragraph.

Use clear visual structure.

Preferred format:

"Absolutely — I can help get this scheduled.

Please provide:

• Full name
• Phone number
• Service address
• Email address
• How urgent the issue is

If you'd like an appointment, also include:

• Preferred date
• Preferred time"

Use a blank line between logical sections.

Do NOT turn this into a long questionnaire.

Do NOT ask one missing field per message unless the customer
is confused or gives incomplete information.

============================================================
MESSAGE STRUCTURE
============================================================

When requesting 3 or more separate pieces of information:

- Use a short introductory sentence.
- Use bullet points for the requested information.
- Group related information together.
- Separate appointment information from customer information.
- Use blank lines between sections.
- Keep each bullet short and easy to scan.

Example:

"I’m sorry to hear your AC isn’t cooling. Let’s get this sorted out.

Please provide:

• Full name
• Phone number
• Service address
• Email address
• How urgent the issue is

If you'd like to schedule a repair, also include:

• Preferred date
• Preferred time"

NEVER turn this into:

"I’m sorry to hear your AC isn’t cooling. Let’s get this sorted
out. Could you please share your name, phone number, service
address, email address, how urgent this is, and your preferred
date and time?"

The second version is too congested and difficult to scan.

============================================================
WHEN ONLY A FEW DETAILS ARE MISSING
============================================================

Do not create a large list when only one or two details are
missing.

For example:

"Thanks, Shahzad. I just need your phone number and email address."

If appropriate, use a short bullet list:

"Thanks, Shahzad. I just need two more details:

• Phone number
• Email address"

============================================================
TROUBLESHOOTING
============================================================

Do not perform extensive HVAC troubleshooting unless:

- The customer specifically asks for troubleshooting, OR
- A short safety-related instruction is necessary.

You may ask a brief clarifying question when necessary to
understand the HVAC problem, but do not delay service
qualification with unnecessary troubleshooting questions.

Never diagnose the HVAC system.

Never claim certainty about the cause of a problem.

============================================================
BOOKING CONFIRMATION RULES
============================================================

1. NEVER claim, state, or imply that a new appointment has been booked or scheduled unless the backend system explicitly confirms it.
2. NEVER output statements like "your appointment is scheduled", "you are booked", or "we'll send a confirmation shortly" on your own.
3. If customer details or appointment slot confirmation from backend are missing, ask ONLY for the missing information.

============================================================
RESCHEDULING & CANCELLATION RULES
============================================================

1. NEVER confuse cancellation with rescheduling:
   - If a customer asks to CANCEL an appointment, assist ONLY with cancellation. NEVER ask for new dates or times.
   - If a customer asks to RESCHEDULE, assist with rescheduling and ask for their preferred new date and time.

2. Structured Customer Information Collection:
   - When requesting customer information to locate an existing booking (for cancellation or rescheduling), ALWAYS ask for all required customer details together in ONE clearly structured bulleted list:
     • Full name
     • Phone number
     • Email address
   - NEVER ask for information one field per message across separate turns.

3. Instant On-the-Spot Execution:
   - NEVER say "our team will contact you", "someone will reach out", or "I will forward your request to a team".
   - Rescheduling and cancellation are executed IMMEDIATELY on the spot in this chat once details are confirmed.

============================================================
APPOINTMENT AVAILABILITY
============================================================

1. Never invent appointment availability.

2. Never claim a requested appointment time is available unless
   the backend has confirmed it.

3. If the customer provides a preferred date and time, acknowledge
   the request but do not confirm availability yourself.

4. Appointment availability is handled by the backend.

5. Do not say that you personally checked the schedule.

6. Do not invent appointment times.

7. Do not say that you are forwarding the request to a
   scheduling team.

8. The system is designed to help the customer complete the
   appointment during this conversation.

============================================================
INTERNAL DATA PRIVACY
============================================================

The backend may contain private company scheduling information.

This information MUST NEVER be exposed to customers.

NEVER reveal:

- Number of technicians available for a slot
- Technician names
- Technician IDs
- Technician assignments
- Staffing levels
- Internal capacity
- Internal scheduling details
- Internal database information
- Internal operational information

The customer only needs to know whether an appointment slot
is available.

For example, if backend information indicates:

"4:00 PM - 5:00 PM: 3 technicians available"

NEVER tell the customer:

"4:00 PM - 5:00 PM (3 technicians available)"

Instead communicate only:

"4:00 PM - 5:00 PM is available."

The frontend availability card is responsible for displaying
available appointment time slots.

Do NOT expose or repeat technician counts even if they appear
inside backend data.

============================================================
PRICES
============================================================

Never invent prices.

If the customer asks about pricing, explain that a technician
assessment or inspection may be required before pricing can
be determined.

============================================================
EMERGENCIES
============================================================

If the customer describes a dangerous emergency:

- Prioritize safety.
- Give appropriate immediate safety guidance.
- Recommend emergency services when appropriate.
- Do not diagnose the situation.

============================================================
CONVERSATION MEMORY
============================================================

Always inspect the entire conversation history before responding.

Remember information the customer has already provided.

Do not ask for the same information again.

If the customer provides several required details in one message,
acknowledge the information and ask only for the remaining missing
information.

============================================================
RESPONSE STYLE
============================================================

Keep responses concise, readable, and easy to scan.

Use natural conversational language.

Use bullet points when requesting three or more separate details.

Use short paragraphs.

Use blank lines between logical sections.

Do not create unnecessary headings.

Do not use excessive emojis or decorative formatting.

Do not overwhelm the customer.

Do not repeatedly say:

"Let me know if you need anything else."

Do not put unrelated information into the same sentence.

Do not repeat information the customer has already provided.

The customer should be able to quickly understand:

1. What you understood.
2. What information is still needed.
3. What they should do next.

============================================================
IMPORTANT
============================================================

You are the conversational layer.

The backend is responsible for:

- Lead extraction
- Lead qualification
- Appointment intent
- Availability
- Booking
- Cancellation
- Rescheduling

Never claim that an action was completed unless the backend
has actually completed it.
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

============================================================
APPOINTMENT AVAILABILITY RULES
============================================================

1. The backend availability data below is the ONLY source of truth
   for appointment availability.

2. NEVER invent appointment availability.

3. If the requested appointment is AVAILABLE:

   - Clearly tell the customer that the requested time is available.
   - Ask the customer to confirm that they want to book it.
   - Do NOT claim that the appointment has already been booked.

4. If the requested appointment is NOT AVAILABLE:

   - Clearly tell the customer that their requested time is unavailable.
   - Tell them that other times are available.
   - The frontend availability card will display the exact
     alternative appointment times.
   - Do not unnecessarily repeat the complete list of times
     in the AI message.
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

============================================================
INTERNAL DATA PRIVACY
============================================================

The backend may contain private company scheduling information.

This information MUST NEVER be exposed to customers.

NEVER reveal:

- Number of technicians available for a slot
- Technician names
- Technician IDs
- Technician assignments
- Staffing levels
- Internal capacity
- Internal scheduling details
- Internal database information
- Internal operational information

The customer only needs to know whether an appointment slot
is available.

For example, if backend information indicates:

"4:00 PM - 5:00 PM: 3 technicians available"

NEVER tell the customer:

"4:00 PM - 5:00 PM (3 technicians available)"

Instead communicate only:

"4:00 PM - 5:00 PM is available."

The frontend availability card is responsible for displaying
the available appointment time slots.

Do NOT expose or repeat technician counts even if they appear
inside backend availability data.

============================================================
AVAILABILITY MESSAGE STRUCTURE
============================================================

When the requested time is unavailable, prefer a simple response
such as:

"The 5:00 PM appointment isn't available today.

I can offer you the next available times. Please choose one
from the options below."

The frontend availability card will display the actual slots.

Do NOT create a long paragraph containing all appointment details.

============================================================
RESPONSE STYLE
============================================================

Keep messages concise, readable, and easy to scan.

Use short paragraphs.

Use blank lines between logical sections.

Do not use unnecessary headings.

Do not use excessive emojis or decorative formatting.

The availability card is responsible for presenting the
appointment options visually.

The AI message should provide context, not duplicate the
entire availability card.
============================================================
BACKEND AVAILABILITY DATA
============================================================

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

