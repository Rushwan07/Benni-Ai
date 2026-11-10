
const mongoose = require("mongoose");

const documentMemorySchema = new mongoose.Schema(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        topic: {
            type: String,
            default: ""
        },

        summary: {
            type: String,
            default: ""
        },

        writingPreferences: {
            type: String,
            default: ""
        },

        // Last message included in the memory summary
        lastSummarizedMessageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DocumentMessage",
            default: null
        },

        // Prevent concurrent memory updates
        memoryUpdateLockedUntil: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "DocumentMemory",
    documentMemorySchema
);
