const aiService = require("../services/aiService");
const conversationService = require("../services/conversationService");

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

        // Create a new conversation if one doesn't exist
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

        // Save user's message
        await conversationService.addMessage(
            conversation.id,
            "USER",
            message
        );

        // Reload conversation including new message
        conversation =
            await conversationService.getConversationById(
                conversation.id
            );

        // Send conversation history to AI
        const aiResponse =
            await aiService.generateAIResponse(
                conversation.messages
            );

        // Save AI response
        await conversationService.addMessage(
            conversation.id,
            "ASSISTANT",
            aiResponse
        );

        res.status(200).json({
            success: true,

            data: {
                conversationId: conversation.id,
                message: aiResponse
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    chat
};