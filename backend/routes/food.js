const express = require("express");
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// ADD FOOD LISTING
// ===============================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("restaurant"),
    async (req, res) => {
        try {
            const {
                foodName,
                quantity,
                description,
                expiryDate
            } = req.body;

            // Check required fields
            if (!foodName || !quantity || !description || !expiryDate) {
                return res.status(400).json({
                    message: "All food fields are required"
                });
            }
// Validate expiry date
const expiry = new Date(expiryDate);

if (isNaN(expiry.getTime())) {
    return res.status(400).json({
        message: "Invalid expiry date"
    });
}

const today = new Date();
today.setHours(0, 0, 0, 0);
expiry.setHours(0, 0, 0, 0);

if (expiry < today) {
    return res.status(400).json({
        message: "Expiry date cannot be in the past"
    });
}

            // Create food listing
            const food = new Food({
                foodName,
                quantity,
                description,
                expiryDate,
                restaurant: req.user.id
            });

            await food.save();

            res.status(201).json({
                message: "Food listing added successfully",
                food
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to add food listing",
                error: error.message
            });
        }
    }
);



 // ===============================
 // VIEW FOOD LISTINGS
 // ===============================
router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
    // Mark expired food listings
    await Food.updateMany(
        {
            expiryDate: { $lt: new Date() },
            status: { $in: ["available", "requested"] }
        },
        {
            $set: { status: "expired" }
        }
    );

    let query = {};
            // Restaurants can see only their own food listings
            if (req.user.role === "restaurant") {
                query.restaurant = req.user.id;
            }

            // NGOs can see only food that is available
            if (req.user.role === "ngo") {
                query.status = "available";
            }

            const foods = await Food.find(query)
                .populate(
                    "restaurant",
                    "name area city pincode"
                );

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
// EDIT FOOD LISTING
// ===============================
router.put("/:id", authMiddleware, roleMiddleware("restaurant"), async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                message: "Food listing not found"
            });
        }

        // Check that this food belongs to the logged-in restaurant
        if (food.restaurant.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own food listings"
            });
        }

        const {
            foodName,
            quantity,
            description,
            expiryDate,
            status
        } = req.body;

        food.foodName = foodName || food.foodName;
        food.quantity = quantity || food.quantity;
        food.description = description || food.description;
        food.expiryDate = expiryDate || food.expiryDate;
        food.status = status || food.status;

        await food.save();

        res.status(200).json({
            message: "Food listing updated successfully",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update food listing",
            error: error.message
        });
    }
});

// ===============================
// DELETE FOOD LISTING
// ===============================
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("restaurant"),
    async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return res.status(404).json({
                    message: "Food listing not found"
                });
            }

            // Check that this food belongs to the logged-in restaurant
            if (food.restaurant.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You can only delete your own food listings"
                });
            }

            await Food.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Food listing deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to delete food listing",
                error: error.message
            });
        }
    }
);
// Export router
module.exports = router;