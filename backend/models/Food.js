const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        foodName: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["available", "requested", "collected"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Food", foodSchema);