const prisma = require("../config/database");

const createConversation = async () => {
    return prisma.conversation.create({
        data: {}
    });
};

const getConversationById = async (conversationId) => {
    return prisma.conversation.findUnique({
        where: {
            id: conversationId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });
};

const addMessage = async (
    conversationId,
    role,
    content
) => {
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId
        }
    });

    if (!conversation) {
        const error = new Error("Conversation not found");
        error.statusCode = 404;
        throw error;
    }

    return prisma.message.create({
        data: {
            conversationId,
            role,
            content
        }
    });
};

module.exports = {
    createConversation,
    getConversationById,
    addMessage
};