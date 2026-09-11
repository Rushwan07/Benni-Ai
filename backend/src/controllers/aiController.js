const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

exports.generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                status: "fail",
                message: "Prompt is required",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `You generate HTML content for a Tiptap rich-text editor.

OUTPUT RULES:
1. Return ONLY raw HTML. No markdown, no code fences, no #, *, or - symbols.
2. Do not include <html>, <head>, or <body> tags — only the content itself.
3. Allowed tags: <h1> <h2> <h3> <p> <strong> <em> <ul> <ol> <li> <blockquote> <br>
4. Every element must contain real text. Never output empty tags, empty <li>, or blank <p> used for spacing.
5. No extra whitespace, line breaks between tags, or entities like &nbsp;.
6. Structure content with headings when appropriate: <h1> for a title, <h2> for sections, <h3> for subsections. Use <strong>/<em> for emphasis, and <ul>/<ol> only when the content is genuinely a list.

Return only the final HTML for this request:${prompt}`,
        });

        return res.status(200).json({
            status: "success",
            content: response.text,
        });
    } catch (error) {
        console.error("Gemini error:", error);

        if (error.status === 503) {
            return res.status(503).json({
                status: "503-error",
                message: "Bennie is currently busy. Please try again in a moment.",
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Failed to generate content",
        });
    }
};