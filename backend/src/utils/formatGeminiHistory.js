module.exports = function formatGeminiHistory(messages) {
    return messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
            {
                text: message.content
            }
        ]
    }));
};
