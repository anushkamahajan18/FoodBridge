const express = require("express");
const User = require("../models/User");
const Food = require("../models/Food");
const DonationRequest = require("../models/DonationRequest");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


const router = express.Router();


// ===============================
// VIEW RESTAURANTS
// ===============================
router.get(
    "/restaurants",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const restaurants = await User.find({
                role: "restaurant"
            }).select("-password");

            res.status(200).json({
                message: "Restaurants fetched successfully",
                restaurants
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch restaurants",
                error: error.message
            });
        }
    }
);


// ===============================
// VIEW NGOs
// ===============================
router.get(
    "/ngos",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const ngos = await User.find({
                role: "ngo"
            }).select("-password");

            res.status(200).json({
                message: "NGOs fetched successfully",
                ngos
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch NGOs",
                error: error.message
            });
        }
    }
);


// ===============================
// ADMIN VIEW ALL FOOD LISTINGS
// ===============================
router.get(
    "/food",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const foods = await Food.find()
                .populate("restaurant", "name email");

            res.status(200).json({
                message: "Food listings fetched successfully",
                foods
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch food listings",
                error: error.message
            });
        }
    }
);

// ===============================
// ADMIN VIEW DONATION REQUESTS
// ===============================
router.get(
    "/donation-requests",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const requests = await DonationRequest.find()
                .populate("food", "foodName quantity description expiryDate")
                .populate("ngo", "name email")
                .populate("restaurant", "name email");

            res.status(200).json({
                message: "Donation requests fetched successfully",
                requests
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch donation requests",
                error: error.message
            });
        }
    }
);

// Export router
module.exports = router;