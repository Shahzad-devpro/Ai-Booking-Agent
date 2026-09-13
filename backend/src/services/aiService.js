const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const generateAIResponse = async (userMessage) => {

    if (!userMessage || !userMessage.trim()) {
        const error = new Error(
            "User message is required"
        );

        error.statusCode = 400;
        throw error;
    }


    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
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

            {
                role: "user",
                content: userMessage
            }
        ],

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


module.exports = {
    generateAIResponse
};