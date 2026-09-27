const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/food");
const donationRequestRoutes = require("./routes/donationRequest");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Test route directly in server
app.get("/test", (req, res) => {
    res.json({
        message: "Main server is working"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Food routes
app.use("/api/food", foodRoutes);

// Donation request routes
app.use("/api/donation-requests", donationRequestRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("FoodBridge Backend is Running");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on http://localhost:${process.env.PORT || 5000}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });