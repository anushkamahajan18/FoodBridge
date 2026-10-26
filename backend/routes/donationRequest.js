const express = require("express");
const DonationRequest = require("../models/DonationRequest");
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// SEND DONATION REQUEST
// ===============================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ngo"),
    async (req, res) => {
        try {
            const io = req.app.get("io");
            const { foodId } = req.body;

            // Check food ID
            if (!foodId) {
                return res.status(400).json({
                    message: "Food ID is required"
                });
            }

            // Find food listing
            const food = await Food.findById(foodId);

            if (!food) {
                return res.status(404).json({
                    message: "Food listing not found"
                });
            }

            // Check food availability
            if (food.status !== "available") {
                return res.status(400).json({
                    message: "Food is not available"
                });
            }

            // Check if NGO already requested this food
            const existingRequest = await DonationRequest.findOne({
                food: foodId,
                ngo: req.user.id
            });

            if (existingRequest) {
                return res.status(400).json({
                    message: "You have already requested this food"
                });
            }

            // Create donation request
            const donationRequest = new DonationRequest({
                food: foodId,
                ngo: req.user.id,
                restaurant: food.restaurant,
                status: "pending"
            });

            await donationRequest.save();

            // Send real-time notification to the restaurant
            io.to(food.restaurant.toString()).emit(
                "new-donation-request",
                {
                    message: "A new NGO has requested your food donation.",
                    foodName: food.foodName
                }
            );

            // Update food status
            food.status = "requested";
            await food.save();

            res.status(201).json({
                message: "Donation request sent successfully",
                donationRequest
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to send donation request",
                error: error.message
            });
        }
    }
);


// ===============================
// NGO REQUEST HISTORY
// ===============================
router.get(
    "/my-requests",
    authMiddleware,
    roleMiddleware("ngo"),
    async (req, res) => {
        try {
          
const requests = await DonationRequest.find({
    ngo: req.user.id
})
    .populate(
        "food",
        "foodName quantity description expiryDate"
    )
    .populate(
        "restaurant",
        "name area city pincode"
    );


            res.status(200).json({
                message: "Request history fetched successfully",
                requests
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch request history",
                error: error.message
            });
        }
    }
);


// ===============================
// RESTAURANT VIEW DONATION REQUESTS
// ===============================
router.get(
    "/restaurant",
    authMiddleware,
    roleMiddleware("restaurant"),
    async (req, res) => {
        try {
            const requests = await DonationRequest.find({
                restaurant: req.user.id
            })
                .populate(
                    "food",
                    "foodName quantity description expiryDate"
                )
                .populate("ngo", "name email");

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


// ===============================
// UPDATE DONATION REQUEST STATUS
// ===============================
router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("restaurant"),
    async (req, res) => {
        try {
            const io = req.app.get("io");
            const { status } = req.body;

            // Check status
            if (!status || !["approved", "rejected"].includes(status)) {
                return res.status(400).json({
                    message: "Status must be approved or rejected"
                });
            }

            // Find request
            const request = await DonationRequest.findById(
                req.params.id
            );

            if (!request) {
                return res.status(404).json({
                    message: "Donation request not found"
                });
            }

            // Check that this request belongs to the logged-in restaurant
            if (request.restaurant.toString() !== req.user.id) {
                return res.status(403).json({
                    message:
                        "You can only manage your own donation requests"
                });
            }

            // Update status
            request.status = status;

            await request.save();

            // Send real-time notification to the NGO
            io.to(request.ngo.toString()).emit(
                "donation-request-status",
                {
                    message:
                        status === "approved"
                            ? "Your donation request has been approved."
                            : "Your donation request has been rejected.",
                    status: status
                }
            );

            res.status(200).json({
                message:
                    "Donation request status updated successfully",
                request
            });

        } catch (error) {
            res.status(500).json({
                message:
                    "Failed to update donation request status",
                error: error.message
            });
        }
    }
);

router.put(
    "/:id/schedule-pickup",
    authMiddleware,
    roleMiddleware("restaurant"),
    async (req, res) => {
        try {
            const { pickupDate, pickupTime, pickupNotes } = req.body;

            if (!pickupDate || !pickupTime) {
                return res.status(400).json({
                    message: "Pickup date and time are required"
                });
            }

            const date = new Date(pickupDate);

            if (Number.isNaN(date.getTime())) {
                return res.status(400).json({
                    message: "Invalid pickup date"
                });
            }

            if (date < new Date()) {
                return res.status(400).json({
                    message: "Pickup date cannot be in the past"
                });
            }

            const request = await DonationRequest.findById(req.params.id);

            if (!request) {
                return res.status(404).json({
                    message: "Donation request not found"
                });
            }

            if (request.restaurant.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You can only schedule pickups for your own requests"
                });
            }

            if (request.status !== "approved") {
                return res.status(400).json({
                    message: "Only approved requests can be scheduled"
                });
            }

            request.pickupDate = date;
            request.pickupTime = pickupTime;
            request.pickupNotes = pickupNotes || "";

            await request.save();

            const io = req.app.get("io");

            io.to(request.ngo.toString()).emit(
                "donation-request-status",
                {
                    message: "A pickup has been scheduled for your donation request.",
                    status: request.status,
                    pickupDate: request.pickupDate,
                    pickupTime: request.pickupTime,
                    pickupNotes: request.pickupNotes
                }
            );

            return res.status(200).json({
                message: "Pickup scheduled successfully",
                request
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to schedule pickup",
                error: error.message
            });
        }
    }
);


router.get(
    "/:id/contact",
    authMiddleware,
    roleMiddleware("ngo"),
    async (req, res) => {
        try {
            const request = await DonationRequest.findOne({
                _id: req.params.id,
                ngo: req.user.id
            }).populate(
                "restaurant",
                "name phone email"
            );

            if (!request) {
                return res.status(404).json({
                    message: "Donation request not found"
                });
            }

            if (request.status !== "approved") {
                return res.status(403).json({
                    message:
                        "Contact details are available only after approval"
                });
            }

            if (!request.restaurant) {
                return res.status(404).json({
                    message: "Restaurant details not found"
                });
            }

            res.status(200).json({
                contact: {
                    name: request.restaurant.name,
                    phone: request.restaurant.phone,
                    email: request.restaurant.email
                }
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch contact details",
                error: error.message
            });
        }
    }
);

// Export router
module.exports = router;