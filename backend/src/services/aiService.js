const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateAIResponse = async (conversationMessages) => {

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
- Never invent prices.
- Never diagnose dangerous situations.
- Never claim an appointment is available unless the backend confirms it.
- If a customer describes an emergency, prioritize safety.
- Ask relevant follow-up questions when information is missing.
`
        },

        ...conversationMessages.map((message) => ({
            role: message.role.toLowerCase(),
            content: message.content
        }))
    ];

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages,

        temperature: 0.3,
        max_tokens: 500
    });

    const response =
        completion.choices[0]?.message?.content;

    if (!response) {
        const error = new Error(
            "AI returned an empty response"
        );

        error.statusCode = 502;
        throw error;
    }

    return response;
};

const extractLeadData = async (conversationMessages) => {
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

    const messages = [
        {
            role: "system",
            content: `
You extract structured lead information from an HVAC customer conversation.

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

Rules:

1. Only extract information explicitly provided or clearly stated by the customer.
2. Never invent missing information.
3. Use null for unknown fields.
4. wantsAppointment must be true only when the customer clearly wants to schedule an appointment.
5. preferredDate must be null if the customer has not provided a date.
6. preferredTime must be null if the customer has not provided a time.
7. problemDescription should summarize the customer's actual HVAC problem.
8. Determine urgency from the conversation, but do not exaggerate.
9. If the customer describes an immediate dangerous situation, use EMERGENCY.
10. Return JSON only. Do not include markdown or explanations.
`
        },

        ...conversationMessages.map((message) => ({
            role: message.role.toLowerCase(),
            content: message.content
        }))
    ];

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages,

        temperature: 0,
        max_tokens: 500,

        response_format: {
            type: "json_object"
        }
    });

    const response =
        completion.choices[0]?.message?.content;

    if (!response) {
        const error = new Error(
            "AI returned an empty extraction response"
        );

        error.statusCode = 502;
        throw error;
    }

    try {
        return JSON.parse(response);
    } catch (error) {
        const parseError = new Error(
            "AI returned invalid JSON"
        );

        parseError.statusCode = 502;
        throw parseError;
    }
};

module.exports = {
    generateAIResponse,
    extractLeadData
};