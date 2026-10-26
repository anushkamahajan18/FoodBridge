
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");
const Food = require("./models/Food");

dotenv.config();

const restaurants = [
    ["Spice Garden Restaurant", "spicegarden@foodbridge.test", "Baner", "Pune", "411045"],
    ["Green Leaf Kitchen", "greenleaf@foodbridge.test", "Kothrud", "Pune", "411038"],
    ["Tasty Bites Cafe", "tastybites@foodbridge.test", "Karvenagar", "Pune", "411052"],
    ["Urban Feast", "urbanfeast@foodbridge.test", "Viman Nagar", "Pune", "411014"],
    ["Royal Kitchen", "royalkitchen@foodbridge.test", "Hinjawadi", "Pune", "411057"],
    ["Fresh Plate Restaurant", "freshplate@foodbridge.test", "Aundh", "Pune", "411007"],
    ["Annapurna Foods", "annapurna@foodbridge.test", "Wakad", "Pune", "411057"],
    ["Daily Dine", "dailydine@foodbridge.test", "Hadapsar", "Pune", "411028"],
    ["Food Corner", "foodcorner@foodbridge.test", "Shivajinagar", "Pune", "411005"],
    ["Healthy Harvest", "healthyharvest@foodbridge.test", "Kharadi", "Pune", "411014"],
    ["Sunrise Cafe", "sunrisecafe@foodbridge.test", "Pimple Saudagar", "Pune", "411027"],
    ["The Healthy Bowl", "healthybowl@foodbridge.test", "Magarpatta", "Pune", "411028"],
    ["Spice Route Kitchen", "spiceroute@foodbridge.test", "Koregaon Park", "Pune", "411001"],
    ["Urban Tadka", "urbantadka@foodbridge.test", "Pimple Nilakh", "Pune", "411027"],
    ["Daily Delight Foods", "dailydelight@foodbridge.test", "Bavdhan", "Pune", "411021"],
    ["Harvest Table", "harvesttable@foodbridge.test", "Pashan", "Pune", "411021"],
    ["City Meals Cafe", "citymeals@foodbridge.test", "Kondhwa", "Pune", "411048"],
    ["Golden Spoon Kitchen", "goldenspoon@foodbridge.test", "Warje", "Pune", "411058"],
    ["Fresh Start Cafe", "freshstart@foodbridge.test", "Camp", "Pune", "411001"],
    ["Community Kitchen", "communitykitchen@foodbridge.test", "Deccan Gymkhana", "Pune", "411004"],
];

const ngos = [
    ["Food Relief Organization", "ngo01@foodbridge.test", "Baner", "Pune", "411045"],
    ["Community Support Foundation", "ngo02@foodbridge.test", "Kothrud", "Pune", "411038"],
    ["Hope Kitchen Foundation", "ngo03@foodbridge.test", "Karvenagar", "Pune", "411052"],
    ["Helping Hands Foundation", "ngo04@foodbridge.test", "Viman Nagar", "Pune", "411014"],
    ["Care Connect Foundation", "ngo05@foodbridge.test", "Hinjawadi", "Pune", "411057"],
    ["Udaan Welfare Society", "ngo06@foodbridge.test", "Aundh", "Pune", "411007"],
    ["Seva Support Foundation", "ngo07@foodbridge.test", "Wakad", "Pune", "411057"],
    ["Hope For All Foundation", "ngo08@foodbridge.test", "Hadapsar", "Pune", "411028"],
    ["Meal Share Foundation", "ngo09@foodbridge.test", "Shivajinagar", "Pune", "411005"],
    ["Helping Hearts Foundation", "ngo10@foodbridge.test", "Kharadi", "Pune", "411014"],
    ["Neighbourhood Aid Society", "ngo11@foodbridge.test", "Pimple Saudagar", "Pune", "411027"],
    ["Food For Everyone Foundation", "ngo12@foodbridge.test", "Magarpatta", "Pune", "411028"],
    ["Care And Share Foundation", "ngo13@foodbridge.test", "Koregaon Park", "Pune", "411001"],
    ["Community Meals Foundation", "ngo14@foodbridge.test", "Pimple Nilakh", "Pune", "411027"],
    ["Umeed Support Foundation", "ngo15@foodbridge.test", "Bavdhan", "Pune", "411021"],
    ["Community Care Trust", "ngo16@foodbridge.test", "Pashan", "Pune", "411021"],
    ["Food Bridge Foundation", "ngo17@foodbridge.test", "Kondhwa", "Pune", "411048"],
    ["Serve With Love Foundation", "ngo18@foodbridge.test", "Warje", "Pune", "411058"],
    ["Community Welfare Society", "ngo19@foodbridge.test", "Camp", "Pune", "411001"],
    ["Anand Seva Foundation", "ngo20@foodbridge.test", "Deccan Gymkhana", "Pune", "411004"],
];


const foodListings = [
    ["Veg Meal Boxes", 25, "25 vegetarian meal boxes.", 1],
    ["Rice And Dal", 15, "15 portions of rice and dal.", 2],
    ["Chapati And Sabzi", 30, "30 portions of chapati and vegetable curry.", 3],
    ["Breakfast Packs", 20, "20 breakfast packs.", 4],
    ["Vegetable Pulao", 18, "18 portions of vegetable pulao.", 5],
    ["Sandwich Packs", 12, "12 sandwich packs.", 6],
    ["Idli Packs", 24, "24 portions of idli and chutney.", 7],
    ["Dal Khichdi", 20, "20 portions of dal khichdi.", 8],
    ["Poha Packs", 16, "16 poha packs.", 9],
    ["Fruit Packs", 20, "20 mixed fruit packs.", 10],
    ["Roti Meal", 14, "14 portions of roti and sabzi.", 11],
    ["Veg Biryani", 22, "22 portions of vegetable biryani.", 12],
    ["Lemon Rice", 18, "18 portions of lemon rice.", 13],
    ["Upma Packs", 15, "15 upma packs.", 14],
    ["Chapati Packs", 25, "25 chapati packs.", 15],
    ["Sambar Rice", 20, "20 portions of sambar rice.", 16],
    ["Thepla Packs", 12, "12 thepla packs.", 17],
    ["Curd Rice", 16, "16 portions of curd rice.", 18],
    ["Snack Packs", 20, "20 snack packs.", 19],
    ["Mixed Veg Meals", 25, "25 portions of mixed vegetable meals.", 20],
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
        console.log("Database:", mongoose.connection.name);

        const password = await bcrypt.hash("123456", 10);
        // Create admin account
const adminEmail = "admin@foodbridge.com";
const adminPassword = await bcrypt.hash("ChangeMe@123", 10);

let admin = await User.findOne({ email: adminEmail });

if (!admin) {
    await User.create({
        name: "FoodBridge Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        phone: "",
        area: "Pune",
        city: "Pune",
        pincode: "411001"
    });

    console.log("Admin account created.");
} else {
    console.log("Admin account already exists.");
}
        const restaurantIds = [];

        let createdUsers = 0;
        let updatedUsers = 0;
        let createdFoods = 0;
        let updatedFoods = 0;

        async function seedAccounts(accounts, role) {
            for (const [name, email, area, city, pincode] of accounts) {
                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name,
                        email,
                        password,
                        role,
                        phone: "",
                        area,
                        city,
                        pincode,
                    });

                    createdUsers++;
                } else {
                    user.name = name;
                    user.role = role;
                    user.area = area;
                    user.city = city;
                    user.pincode = pincode;

                    await user.save();
                    updatedUsers++;
                }

                if (role === "restaurant") {
                    restaurantIds.push(user._id);
                }
            }
        }

        await seedAccounts(restaurants, "restaurant");
        await seedAccounts(ngos, "ngo");

        for (const [foodName, quantity, description, restaurantNumber] of foodListings) {
            const restaurant = restaurantIds[restaurantNumber - 1];

            if (!restaurant) {
                throw new Error(`Restaurant ${restaurantNumber} was not found`);
            }

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            expiryDate.setHours(23, 59, 0, 0);

            let food = await Food.findOne({
                foodName,
                restaurant,
            });

            if (!food) {
                await Food.create({
                    foodName,
                    quantity,
                    description,
                    expiryDate,
                    restaurant,
                });

                createdFoods++;
            } else {
                food.quantity = quantity;
                food.description = description;
                food.expiryDate = expiryDate;

                await food.save();
                updatedFoods++;
            }
        }

        console.log("--------------------------------");
        console.log("New user accounts:", createdUsers);
        console.log("Existing accounts updated:", updatedUsers);
        console.log("New food listings:", createdFoods);
        console.log("Existing food listings updated:", updatedFoods);
        console.log("New accounts password: 123456");
        console.log("Seeding completed.");

    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

seedUsers();
