const aiService = require("../services/aiService");

const conversationService =
    require("../services/conversationService");

const leadServices =
    require("../services/leadServices");

const {
    validateExtractedLeadData,
    getLeadQualification
} = require("../services/leadExtractionService");

const chat = async (req, res, next) => {
    try {
        const {
            conversationId,
            message
        } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        let conversation;

        // 1. Create or retrieve conversation
        if (!conversationId) {

            conversation =
                await conversationService.createConversation();

        } else {

            conversation =
                await conversationService.getConversationById(
                    conversationId
                );

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation not found"
                });
            }
        }

        // 2. Save user's message
        await conversationService.addMessage(
            conversation.id,
            "USER",
            message
        );

        // 3. Reload conversation with latest message
        conversation =
            await conversationService.getConversationById(
                conversation.id
            );

        // 4. Generate AI response
        const aiResponse =
            await aiService.generateAIResponse(
                conversation.messages
            );

        // 5. Save AI response
        await conversationService.addMessage(
            conversation.id,
            "ASSISTANT",
            aiResponse
        );

        // 6. Reload conversation with AI response
        conversation =
            await conversationService.getConversationById(
                conversation.id
            );

        // 7. Extract structured lead information
        const extractedData =
            await aiService.extractLeadData(
                conversation.messages
            );

        // 8. Validate AI output
        const validatedData =
            validateExtractedLeadData(
                extractedData
            );

        // 9. Check whether enough information exists
        const qualification =
            getLeadQualification(
                validatedData
            );

        let lead = null;

        // 10. Create lead only when qualified
        if (qualification.qualified) {

            lead =
                await leadServices.createLeadFromConversation({
                    conversationId: conversation.id,
                    leadData: validatedData
                });
        }

        // 11. Return response
        res.status(200).json({
            success: true,

            data: {
                conversationId: conversation.id,
                message: aiResponse,
                qualification,
                lead
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    chat
};