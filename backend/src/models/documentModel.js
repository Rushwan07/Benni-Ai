const mongoose = require("mongoose");

const { Schema } = require("mongoose");

const documentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: false
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Documnet = mongoose.model("Document", documentSchema);

module.exports = Documnet;