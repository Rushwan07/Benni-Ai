
const { GoogleGenAI } = require("@google/genai");

const DocumentMessage = require("../models/documentMessageModel");
const DocumentMemory = require("../models/documentMemoryModel");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL_NAME = "gemini-3.5-flash-lite";

exports.getDocumentHistory = async (documentId, userId) => {
    const messages = await DocumentMessage.find({
        document: documentId,
        user: userId
    })
        .sort({ createdAt: -1, _id: -1 })
        .limit(10)
        .lean();

    return messages.reverse();
};

exports.updateDocumentMemory = async (documentId, userId) => {
    try {
        // 1. Get existing memory
        const memory = await DocumentMemory.findOne({
            document: documentId,
            user: userId
        });

        // 2. Get unsummarized messages
        const query = {
            document: documentId,
            user: userId
        };

        if (memory?.lastSummarizedMessageId) {
            query._id = {
                $gt: memory.lastSummarizedMessageId
            };
        }

        const newMessages = await DocumentMessage.find(query)
            .sort({ createdAt: 1, _id: 1 })
            .limit(10)
            .lean();

        // 3. Wait until 10 new messages exist
        if (newMessages.length < 10) {
            console.log(
                `Memory update skipped: ${newMessages.length}/10 messages`
            );
            return null;
        }

        // 4. Prepare conversation
        const conversation = newMessages.map(message => {
            const cleanContent = message.content
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            return `${message.role}: ${cleanContent}`;
        }).join("\n");

        // 5. Generate updated memory
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `
You are Benni's document memory manager.

Previous memory:
${memory?.summary || "No previous memory"}

Previous topic:
${memory?.topic || "Unknown"}

Previous writing preferences:
${memory?.writingPreferences || "Unknown"}

New conversation:
${conversation}

Update the previous memory with important new information.

Return ONLY valid JSON:
{
    "topic": "Main topic",
    "summary": "Compact document memory",
    "writingPreferences": "Writing preferences"
}

Preserve important previous information.
Do not invent facts.
`,
            config: {
                responseMimeType: "application/json",
                maxOutputTokens: 400,
                temperature: 0.2
            }
        });

        // 6. Parse Gemini response
        const memoryData = JSON.parse(response.text);

        // 7. Create or update memory
        const updatedMemory = await DocumentMemory.findOneAndUpdate(
            {
                document: documentId,
                user: userId
            },
            {
                $set: {
                    topic: memoryData.topic,
                    summary: memoryData.summary,
                    writingPreferences: memoryData.writingPreferences,
                    lastSummarizedMessageId:
                        newMessages[newMessages.length - 1]._id
                }
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        console.log("Document memory updated successfully");

        return updatedMemory;

    } catch (error) {
        console.error("Memory update failed:", error);
        throw error;
    }
};
