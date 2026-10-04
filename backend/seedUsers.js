const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const restaurants = [
    ["Spice Garden Restaurant", "spicegarden@foodbridge.test"],
    ["Green Leaf Kitchen", "greenleaf@foodbridge.test"],
    ["Tasty Bites Cafe", "tastybites@foodbridge.test"],
    ["Urban Feast", "urbanfeast@foodbridge.test"],
    ["Royal Kitchen", "royalkitchen@foodbridge.test"],
    ["Fresh Plate Restaurant", "freshplate@foodbridge.test"],
    ["Annapurna Foods", "annapurna@foodbridge.test"],
    ["Daily Dine", "dailydine@foodbridge.test"],
    ["Food Corner", "foodcorner@foodbridge.test"],
    ["Healthy Harvest", "healthyharvest@foodbridge.test"],
];

const ngos = [
    ["Helping Hands Foundation", "helpinghands@foodbridge.test"],
    ["Hope For All NGO", "hopeforall@foodbridge.test"],
    ["Care & Share Foundation", "careshare@foodbridge.test"],
    ["Food For Everyone", "foodforeveryone@foodbridge.test"],
    ["Smile Foundation", "smilefoundation@foodbridge.test"],
    ["Community Care Trust", "communitycare@foodbridge.test"],
    ["Serve With Love", "servewithlove@foodbridge.test"],
    ["Anand Seva NGO", "anandseva@foodbridge.test"],
    ["Udaan Welfare Society", "udaanwelfare@foodbridge.test"],
    ["Helping Hearts NGO", "helpinghearts@foodbridge.test"],
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const password = await bcrypt.hash("123456", 10);

        let restaurantCount = 0;
        let ngoCount = 0;

        for (const [name, email] of restaurants) {
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                await User.create({
                    name,
                    email,
                    password,
                    role: "restaurant",
                });

                restaurantCount++;
            }
        }

        for (const [name, email] of ngos) {
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                await User.create({
                    name,
                    email,
                    password,
                    role: "ngo",
                });

                ngoCount++;
            }
        }

        console.log(`Restaurants added: ${restaurantCount}`);
        console.log(`NGOs added: ${ngoCount}`);
        console.log("Dummy users seeding completed!");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
};

seedUsers();