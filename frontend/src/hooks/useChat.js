import { useState } from "react";
import { sendChatMessage } from "../services/chatApi";

const initialMessages = [
    {
        id: 1,
        role: "assistant",
        content:
            "Hi! I'm CoolAir's AI receptionist. I can help with HVAC service requests and scheduling.",
    },
    {
        id: 2,
        role: "assistant",
        content:
            "Tell me what's going on with your heating or cooling system, and I'll help you with the next step.",
    },
];

const useChat = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [conversationId, setConversationId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (message) => {
        const trimmedMessage = message?.trim();

        if (!trimmedMessage || isTyping) {
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmedMessage,
        };

        setMessages((current) => [...current, userMessage]);
        setIsTyping(true);
        setError(null);

        try {
            const data = await sendChatMessage({
                conversationId,
                message: trimmedMessage,
            });

            if (data?.conversationId) {
                setConversationId(data.conversationId);
            }

            if (data?.message) {
                const assistantMessage = {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: data.message,

                    // Preserve structured backend data.
                    availability: data.availability ?? null,
                    appointment: data.appointment ?? null,
                    lead: data.lead ?? null,

                    qualification: data.qualification ?? null,
                    appointmentIntent:
                        data.appointmentIntent ?? null,
                    bookingIntent:
                        data.bookingIntent ?? null,
                    cancellationIntent:
                        data.cancellationIntent ?? null,
                    rescheduleIntent:
                        data.rescheduleIntent ?? null,
                };

                setMessages((current) => [
                    ...current,
                    assistantMessage,
                ]);
            }

            return data;
        } catch (requestError) {
            const messageText =
                requestError?.message ||
                "Something went wrong. Please try again.";

            setError(messageText);

            const errorMessage = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content:
                    "I'm sorry, I couldn't process that request right now. Please try again.",
            };

            setMessages((current) => [
                ...current,
                errorMessage,
            ]);

            throw requestError;
        } finally {
            setIsTyping(false);
        }
    };

    const resetChat = () => {
        setMessages(initialMessages);
        setConversationId(null);
        setIsTyping(false);
        setError(null);
    };

    return {
        messages,
        conversationId,
        isTyping,
        error,
        sendMessage,
        resetChat,
    };
};

export default useChat;