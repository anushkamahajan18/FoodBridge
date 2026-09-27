const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },

        ngo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "DonationRequest",
    donationRequestSchema
);