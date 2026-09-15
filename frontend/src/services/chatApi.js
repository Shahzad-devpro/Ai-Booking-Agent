const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const sendChatMessage = async ({
    conversationId = null,
    message,
}) => {
    if (!message || typeof message !== "string" || !message.trim()) {
        throw new Error("Message is required.");
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversationId,
            message: message.trim(),
        }),
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            `Server returned an invalid response (${response.status}).`
        );
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
                `Request failed with status ${response.status}.`
        );
    }

    if (!data?.success) {
        throw new Error(
            data?.message || "The chat request could not be completed."
        );
    }

    return data.data;
};