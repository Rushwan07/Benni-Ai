
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const Document = require("../models/documentModel");
const DocumentMessage = require("../models/documentMessageModel");
const DocumentMemory = require("../models/documentMemoryModel");

const {
    getDocumentHistory,
    updateDocumentMemory
} = require("../services/memoryService");

const formatGeminiHistory = require("../utils/formatGeminiHistory");

const MODEL_NAME = "gemini-3.5-flash-lite";

exports.generateContent = async (req, res) => {
    try {
        const { prompt, documentId, type, text } = req.body;

        const userId = req.user._id;
        // console.log(prompt, documentId, type, text)

        // 1. Validate document ID
        if (!documentId) {
            return res.status(400).json({
                status: "fail",
                message: "Document ID is required",
            });
        }

        // 2. Verify document ownership
        const document = await Document.findOne({
            _id: documentId,
            user: userId,
        }).lean();

        if (!document) {
            return res.status(404).json({
                status: "fail",
                message: "Document not found",
            });
        }

        // ==========================================
        // TEXT ACTIONS
        // ==========================================

        if (type) {

            // Validate selected text
            if (!text || !text.trim()) {
                return res.status(400).json({
                    status: "fail",
                    message: "Selected text is required",
                });
            }

            // Predefined action instructions
            const actionPrompts = {
                improve: "Improve the clarity, readability, and flow of the selected text. Preserve its original meaning.",

                grammar: "Correct grammar, spelling, and punctuation mistakes. Do not change the original meaning.",

                summarize: "Summarize the selected text while preserving its important information.",

                professional: "Rewrite the selected text in a professional tone while preserving its meaning.",
            };

            let instruction;

            // Custom prompt
            if (type === "custom") {

                if (!prompt || !prompt.trim()) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Custom prompt is required",
                    });
                }

                instruction = prompt;

            } else {

                instruction = actionPrompts[type];

                if (!instruction) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Invalid action type",
                    });
                }
            }

            // Generate processed text
            const response = await ai.models.generateContent({
                model: MODEL_NAME,

                contents: `
You are Benni, an intelligent AI writing assistant.

TASK:
${instruction}

SELECTED TEXT:
${text}

RULES:
1. Return ONLY raw HTML.
2. Never include markdown or code fences.
3. Do not include html, head, or body tags.
4. Allowed tags: h1, h2, h3, p, strong, em, ul, ol, li, blockquote, br.
5. Never output empty elements.
6. Preserve the meaning and context of the user's request.
7. If the user says "add more details", understand the previous topic.
8. Follow established writing preferences.
9. Do not invent facts.
`,

                config: {
                    temperature: 0.3,
                },
            });

            const generatedText = response.text;

            if (!generatedText) {
                throw new Error("Gemini returned an empty response");
            }

            console.log("GENERATED", generatedText)

            return res.status(200).json({
                status: "success",
                content: generatedText,
            });
        }

        // ==========================================
        // NORMAL DOCUMENT GENERATION
        // ==========================================

        // 3. Validate normal generation prompt
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                status: "fail",
                message: "Prompt is required",
            });
        }

        // 4. Retrieve previous conversation
        const history = await getDocumentHistory(
            documentId,
            userId
        );

        // 5. Retrieve document memory
        const memory = await DocumentMemory.findOne({
            document: documentId,
            user: userId,
        }).lean();

        // 6. Format Gemini history
        const formattedHistory = formatGeminiHistory(history);

        // 7. Prepare document context
        const documentContext = `
DOCUMENT TITLE:
${document.title}

DOCUMENT CONTENT:
${document.content || "No existing content."}

DOCUMENT MEMORY:
${memory?.summary || "No previous summary available."}

CURRENT TOPIC:
${memory?.topic || "Not established yet."}

WRITING PREFERENCES:
${memory?.writingPreferences || "No preferences established yet."}
`;

        // 8. Create Gemini chat
        const chat = ai.chats.create({
            model: MODEL_NAME,

            history: formattedHistory,

            config: {
                systemInstruction: `
You are Benni, an intelligent AI writing assistant.

Your task is to generate HTML content for a Tiptap rich-text editor.

Understand the document context, previous conversation
and persistent document memory.

OUTPUT RULES:

1. Return ONLY raw HTML.
2. Never include markdown or code fences.
3. Do not include html, head, or body tags.
4. Allowed tags: h1, h2, h3, p, strong, em, ul, ol, li, blockquote, br.
5. Never output empty elements.
6. Preserve the meaning and context of the user's request.
7. If the user says "add more details", understand the previous topic.
8. Follow established writing preferences.
9. Do not invent facts.

DOCUMENT CONTEXT:
${documentContext}
`,
            },
        });

        // 9. Generate content
        const response = await chat.sendMessage({
            message: prompt,
        });

        const generatedContent = response.text;

        if (!generatedContent) {
            throw new Error("Gemini returned an empty response");
        }

        // 10. Save conversation messages
        await DocumentMessage.create([
            {
                document: documentId,
                user: userId,
                role: "user",
                content: prompt,
                contentType: "text",
            },
            {
                document: documentId,
                user: userId,
                role: "assistant",
                content: generatedContent,
                contentType: "html",
            },
        ]);

        // 11. Automatically update document memory
        updateDocumentMemory(documentId, userId)
            .catch(error => {
                console.error("Background memory update failed:", error);
            });

        // 12. Return generated content
        return res.status(200).json({
            status: "success",
            content: generatedContent,
        });

    } catch (error) {
        console.error("Gemini error:", error);

        if (error.status === 503) {
            return res.status(503).json({
                status: "503-error",
                message: "Benni is currently busy. Please try again.",
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Failed to generate content",
        });
    }
};
