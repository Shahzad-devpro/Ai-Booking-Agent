require("dotenv").config();

const {
    extractLeadData
} = require("../src/services/aiService");

const {
    validateExtractedLeadData, 
    getLeadQualification
} = require("../src/services/leadExtractionService");



const test = async () => {
    try {

       const conversationMessages = [
    {
        role: "USER",
        content: "Hi, my AC is running but it is not producing cold air."
    },
    {
        role: "ASSISTANT",
        content: "I'm sorry to hear that. How long has this been happening?"
    },
    {
        role: "USER",
        content: "Since yesterday. My name is John Smith and I live at 123 Main Street, New York."
    },
    {
        role: "ASSISTANT",
        content: "Could I get your phone number so we can help you with the service?"
    },
    {
        role: "USER",
        content: "Sure, my phone number is 555-123-4567."
    }
];
       const extractedData =
    await extractLeadData(
        conversationMessages
    );

const result =
    validateExtractedLeadData(
        extractedData
    );

    const qualification =
    getLeadQualification(result);

console.log("\nQUALIFICATION:\n");

console.log(
    JSON.stringify(
        qualification,
        null,
        2
    )
);

        console.log("\nEXTRACTED LEAD DATA:\n");

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (error) {

        console.error("\nAI ERROR:\n");
        console.error(error);

    }
};

test();