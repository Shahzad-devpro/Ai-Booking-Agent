const getCancellationIntent = ({
    customerMessage,
    conversationMessages = []
}) => {

    if (
        !customerMessage ||
        typeof customerMessage !== "string"
    ) {
        return {
            wantsCancellation: false
        };
    }


    const normalizedMessage =
        customerMessage
            .trim()
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, " ");


    const cancellationPatterns = [

        /\bcancel\b/,
        /\bcancellation\b/,
        /\bcall off\b/,
        /\bcall it off\b/

    ];


    const hasDirectCancellation =
        cancellationPatterns.some(
            pattern =>
                pattern.test(
                    normalizedMessage
                )
        );


    // ========================================================
    // ONGOING CANCELLATION CONTEXT DETECTOR
    // ========================================================

    let isOngoingCancellationFlow = false;

    if (Array.isArray(conversationMessages) && conversationMessages.length > 0) {

        let lastCompletedIndex = -1;

        for (let i = conversationMessages.length - 1; i >= 0; i--) {
            const msg = conversationMessages[i];
            if (
                msg &&
                msg.role === "ASSISTANT" &&
                typeof msg.content === "string" &&
                /\bhas been cancelled successfully\b/i.test(msg.content)
            ) {
                lastCompletedIndex = i;
                break;
            }
        }

        const startIndex = lastCompletedIndex >= 0 ? lastCompletedIndex + 1 : 0;

        for (let i = startIndex; i < conversationMessages.length; i++) {
            const msg = conversationMessages[i];
            if (!msg || typeof msg.content !== "string") continue;

            const content = msg.content.trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");

            const indicatesCancellationUser = cancellationPatterns.some(pattern => pattern.test(content));

            const indicatesCancellationAssistant =
                msg.role === "ASSISTANT" && (
                    /\bcancel\b/.test(content) ||
                    /\bcancellation\b/.test(content)
                );

            if (indicatesCancellationUser || indicatesCancellationAssistant) {
                isOngoingCancellationFlow = true;
                break;
            }
        }
    }


    const wantsCancellation =
        hasDirectCancellation || isOngoingCancellationFlow;


    return {
        wantsCancellation
    };
};


module.exports = {
    getCancellationIntent
};
