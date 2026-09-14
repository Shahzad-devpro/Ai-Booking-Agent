require("dotenv").config();

const prisma = require("../src/config/database");

const {
    createLeadFromConversation
} = require("../src/services/leadServices");

const test = async () => {

    try {

        const conversation =
            await prisma.conversation.create({
                data: {}
            });

        const leadData = {
            customer: {
                name: "John Smith",
                phone: "555-123-4567",
                email: null,
                address: "123 Main Street, New York"
            },

            service: "AC_REPAIR",

            problemDescription:
                "AC running but not producing cold air",

            urgency: "NORMAL",

            wantsAppointment: false,

            preferredDate: null,

            preferredTime: null
        };

        const lead =
            await createLeadFromConversation({
                conversationId: conversation.id,
                leadData
            });

        console.log("\nLEAD CREATED:\n");

        console.log(
            JSON.stringify(
                lead,
                null,
                2
            )
        );

        console.log("\nCONVERSATION ID:\n");

        console.log(conversation.id);

    } catch (error) {

        console.error("\nERROR:\n");
        console.error(error);

    } finally {

        await prisma.$disconnect();

    }
};

test();