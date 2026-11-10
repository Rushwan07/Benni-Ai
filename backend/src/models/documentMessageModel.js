
const mongoose = require("mongoose");

const documentMessageSchema = new mongoose.Schema(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        content: {
            type: String,
            required: true
        },

        contentType: {
            type: String,
            enum: ["text", "html"],
            default: "text"
        }
    },
    {
        timestamps: true
    }
);

// Efficient retrieval of a document's conversation
documentMessageSchema.index({
    document: 1,
    user: 1,
    createdAt: -1
});

const DocumentMessage = mongoose.model(
    "DocumentMessage",
    documentMessageSchema
);

module.exports = DocumentMessage;
