import { useState } from "react";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [userName, setUserName] = useState("");
    const [showHome, setShowHome] = useState(false);

    // Registration
    const [showRegister, setShowRegister] = useState(false);
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerRole, setRegisterRole] = useState("restaurant");
    const [registerMessage, setRegisterMessage] = useState("");

    // Restaurant section
    const [restaurantSection, setRestaurantSection] = useState("dashboard");

    // Restaurant - Food form
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [foodMessage, setFoodMessage] = useState("");
    const [editingFoodId, setEditingFoodId] = useState(null);

    // Food listings
    const [foods, setFoods] = useState([]);
    const [showFoods, setShowFoods] = useState(false);

    // Restaurant donation requests
    const [requests, setRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");

    // NGO request history
    const [ngoRequests, setNgoRequests] = useState([]);
    const [showNgoRequests, setShowNgoRequests] = useState(false);
    const [ngoMessage, setNgoMessage] = useState("");

    // NGO available food
    const [availableFoods, setAvailableFoods] = useState([]);
    const [showAvailableFoods, setShowAvailableFoods] = useState(false);
    const [ngoFoodSearch, setNgoFoodSearch] = useState("");
    // NGO notifications
const [showNgoNotifications, setShowNgoNotifications] = useState(false);

    // Admin
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantSearch, setRestaurantSearch] = useState("");
    const [ngos, setNgos] = useState([]);
    const [ngoSearch, setNgoSearch] = useState("");
    const [foodSearch, setFoodSearch] = useState("");
    const [requestSearch, setRequestSearch] = useState("");
    const [adminFoods, setAdminFoods] = useState([]);
    const [adminRequests, setAdminRequests] = useState([]);
    const [showAdminNotifications, setShowAdminNotifications] = useState(false);

    const [showRestaurants, setShowRestaurants] = useState(false);
    const [showNgos, setShowNgos] = useState(false);
    const [showAdminFoods, setShowAdminFoods] = useState(false);
    const [showAdminRequests, setShowAdminRequests] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);

                setRole(data.user.role);
                setUserName(data.user.name);
                setLoggedIn(true);
                setMessage("");

                // Reset sections
                setRestaurantSection("dashboard");
                setShowFoodForm(false);
                setShowFoods(false);
                setShowRequests(false);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Unable to connect to server");
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setLoggedIn(false);
        setRole("");
        setMessage("");
        setShowHome(false);
        setShowRegister(false);

        setShowNgoNotifications(false);
setShowAdminNotifications(false);

        setRestaurantSection("dashboard");
        setShowFoodForm(false);
        setShowFoods(false);
        setShowRequests(false);
    };

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: registerName,
                        email: registerEmail,
                        password: registerPassword,
                        role: registerRole,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRegisterMessage(
                    "Registration successful! You can now login."
                );

                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
            } else {
                setRegisterMessage(data.message);
            }
        } catch (error) {
            setRegisterMessage("Unable to connect to server");
        }
    };

   const handleAddFood = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem("token");

        const url = editingFoodId
            ? `http://localhost:5000/api/food/${editingFoodId}`
            : "http://localhost:5000/api/food";

        const method = editingFoodId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                foodName,
                quantity: Number(quantity),
                description,
                expiryDate,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setFoodMessage(
                editingFoodId
                    ? "Food listing updated successfully!"
                    : "Food listing added successfully!"
            );

            setFoodName("");
            setQuantity("");
            setDescription("");
            setExpiryDate("");
            setEditingFoodId(null);

        } else {
            setFoodMessage(data.message);
        }

    } catch (error) {
        setFoodMessage("Unable to connect to server");
    }
};
    const handleEditFood = (food) => {
    setEditingFoodId(food._id);
    setFoodName(food.foodName);
    setQuantity(food.quantity);
    setDescription(food.description);
    setExpiryDate(
        new Date(food.expiryDate).toISOString().split("T")[0]
    );

    setRestaurantSection("add-food");
    setShowFoodForm(true);
    setShowFoods(false);
    setShowRequests(false);
};

    // VIEW FOOD LISTINGS
    const handleViewFoods = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/food",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setFoods(data.foods);

                setRestaurantSection("foods");

                setShowFoodForm(false);
                setShowFoods(true);
                setShowRequests(false);
            } else {
                setFoodMessage(data.message);
            }
        } catch (error) {
            setFoodMessage("Unable to connect to server");
        }
    };
// DELETE FOOD LISTING
const handleDeleteFood = async (foodId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this food listing?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        const response = await fetch(
            `http://localhost:5000/api/food/${foodId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete food listing");
            return;
        }

        // Remove the deleted food immediately from the screen
        setFoods((currentFoods) =>
            currentFoods.filter(
                (food) => food._id !== foodId
            )
        );

        alert("Food listing deleted successfully.");

    } catch (error) {
        console.error("Delete food error:", error);

        alert(
            "Unable to delete food listing. Please make sure the backend is running."
        );
    }
};
    // VIEW RESTAURANT DONATION REQUESTS
    const handleViewRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/donation-requests/restaurant",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRequests(data.requests);

                setRestaurantSection("requests");

                setShowFoodForm(false);
                setShowFoods(false);
                setShowRequests(true);

                setRequestMessage("");
            } else {
                setRequestMessage(data.message);
            }
        } catch (error) {
            setRequestMessage("Unable to connect to server");
        }
    };

    // APPROVE / REJECT REQUEST
    const handleRequestStatus = async (requestId, status) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/donation-requests/${requestId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRequestMessage(
                    `Donation request ${status} successfully!`
                );

                handleViewRequests();
            } else {
                setRequestMessage(data.message);
            }
        } catch (error) {
            setRequestMessage("Unable to connect to server");
        }
    };

    // NGO - VIEW AVAILABLE FOOD
    const handleViewAvailableFood = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/food",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                const available = data.foods.filter(
                    (food) => food.status === "available"
                );

                setAvailableFoods(available);
                setShowAvailableFoods(true);
                setShowNgoRequests(false);
                setNgoMessage("");
            } else {
                setNgoMessage(data.message);
            }
        } catch (error) {
            setNgoMessage("Unable to connect to server");
        }
    };

    // NGO - REQUEST FOOD
    const handleRequestFood = async (foodId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/donation-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        foodId,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setNgoMessage(
                    "Donation request sent successfully!"
                );

                handleViewAvailableFood();
            } else {
                setNgoMessage(data.message);
            }
        } catch (error) {
            setNgoMessage("Unable to connect to server");
        }
    };

    // NGO - REQUEST HISTORY
    const handleViewNgoRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/donation-requests/my-requests",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setNgoRequests(data.requests);
                setShowNgoRequests(true);
                setShowAvailableFoods(false);
                setNgoMessage("");
            } else {
                setNgoMessage(data.message);
            }
        } catch (error) {
            setNgoMessage("Unable to connect to server");
        }
    };

    // ADMIN - RESTAURANTS
    const handleViewRestaurants = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/restaurants",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRestaurants(data.restaurants);
                setShowRestaurants(true);
                setShowNgos(false);
                setShowAdminFoods(false);
                setShowAdminRequests(false);
                setAdminMessage("");
            } else {
                setAdminMessage(data.message);
            }
        } catch (error) {
            setAdminMessage("Unable to connect to server");
        }
    };

    // ADMIN - NGOS
    const handleViewNgos = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/ngos",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setNgos(data.ngos);
                setShowNgos(true);
                setShowRestaurants(false);
                setShowAdminFoods(false);
                setShowAdminRequests(false);
                setAdminMessage("");
            } else {
                setAdminMessage(data.message);
            }
        } catch (error) {
            setAdminMessage("Unable to connect to server");
        }
    };

    // ADMIN - FOOD
    const handleViewAdminFoods = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/food",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAdminFoods(data.foods);
                setShowAdminFoods(true);
                setShowRestaurants(false);
                setShowNgos(false);
                setShowAdminRequests(false);
                setAdminMessage("");
            } else {
                setAdminMessage(data.message);
            }
        } catch (error) {
            setAdminMessage("Unable to connect to server");
        }
    };

    // ADMIN - DONATION REQUESTS
    const handleViewAdminRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/donation-requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAdminRequests(data.requests);
                setShowAdminRequests(true);
                setShowRestaurants(false);
                setShowNgos(false);
                setShowAdminFoods(false);
                setAdminMessage("");
            } else {
                setAdminMessage(data.message);
            }
        } catch (error) {
            setAdminMessage("Unable to connect to server");
        }
    };
// RESTAURANT DASHBOARD
if (loggedIn && role === "restaurant") {
    return (
        <div className="restaurant-dashboard">

            {/* TOP HEADER */}
            <header className="restaurant-topbar">

                <div className="restaurant-brand">
                    <div className="brand-icon">🍴</div>

                    <div>
                        <h2>FoodBridge</h2>
                        <span>Restaurant Partner</span>
                    </div>
                </div>

               <div className="restaurant-profile">

    <button
    className="notification-button"
    onClick={handleViewRequests}
    title="View donation requests"
>
    🔔

    {requests.filter(
        (request) => request.status === "pending"
    ).length > 0 && (
        <span className="notification-count">
            {
                requests.filter(
                    (request) => request.status === "pending"
                ).length
            }
        </span>
    )}
</button>
    <div className="online-status">
        <span></span>
        Online
    </div>

    <div className="profile-avatar">
        R
    </div>

    <div className="profile-info">
        <strong>Restaurant</strong>
        <span>Partner Account</span>
    </div>

</div>

            </header>


            {/* MAIN LAYOUT */}
            <div className="restaurant-layout">

                {/* SIDEBAR */}
                <aside className="restaurant-sidebar">

                    <div className="sidebar-title">
                        Restaurant Menu
                    </div>

                    <button
                        className="sidebar-button active"
                        onClick={() => {
                            setShowFoodForm(false);
                            setShowFoods(false);
                            setShowRequests(false);
                        }}
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-button"
                        onClick={() => {
                            setShowFoodForm(true);
                            setShowFoods(false);
                            setShowRequests(false);
                        }}
                    >
                        <span>➕</span>
                        Add Food
                    </button>

                    <button
                        className="sidebar-button"
                        onClick={handleViewFoods}
                    >
                        <span>🍱</span>
                        Food Listings
                    </button>

                    <button
                        className="sidebar-button"
                        onClick={handleViewRequests}
                    >
                        <span>📋</span>
                        Donation Requests
                    </button>

                    <div className="sidebar-divider"></div>

                    <button
                        className="sidebar-button logout-sidebar"
                        onClick={handleLogout}
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </aside>


                {/* MAIN CONTENT */}
                <main className="restaurant-main">

                    {/* WELCOME */}
                    <section className="restaurant-welcome">

                        <div>
                            <span className="welcome-label">
                                RESTAURANT PARTNER
                            </span>

                            <h1>
                                Good evening, Restaurant! 👋
                            </h1>

                            <p>
                                Manage your surplus food and help
                                connect meals with NGOs in need.
                            </p>
                        </div>

                        <div className="welcome-food-icon">
                            🍲
                        </div>

                    </section>


                    {/* STATISTICS */}
                    <section className="restaurant-stats">

                        <div className="stat-card">
                            <div className="stat-icon purple">
                                🍱
                            </div>

                            <div>
                                <span>Total Listings</span>
                                <strong>{foods.length}</strong>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon orange">
                                📦
                            </div>

                            <div>
                                <span>Donation Requests</span>
                                <strong>{requests.length}</strong>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon green">
                                ❤️
                            </div>

                            <div>
                                <span>Food Shared</span>
                                <strong>
                                    {foods.reduce(
                                        (total, food) =>
                                            total + Number(food.quantity || 0),
                                        0
                                    )}
                                </strong>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon blue">
                                🤝
                            </div>

                            <div>
                                <span>Community Impact</span>
                                <strong>Active</strong>
                            </div>
                        </div>

                    </section>


                    {/* FEATURED FOOD */}
                    {!showFoodForm &&
                        !showFoods &&
                        !showRequests && (

                        <section className="featured-section">

                            <div className="section-heading">

                                <div>
                                    <span>FOODBRIDGE</span>

                                    <h2>
                                        Manage Your Donations
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowFoodForm(true);
                                        setShowFoods(false);
                                        setShowRequests(false);
                                    }}
                                    className="primary-action"
                                >
                                    + Add Food Listing
                                </button>

                            </div>


                            <div className="food-promo-grid">

                                <div className="food-promo-card">

                                    <div className="food-promo-image food-image-one">
    <img
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
        alt="Fresh food"
    />
</div>

                                    <div className="food-promo-content">

                                        <span className="food-category">
                                            SURPLUS FOOD
                                        </span>

                                        <h3>
                                            Share today's surplus
                                        </h3>

                                        <p>
                                            List fresh food that can
                                            reach NGOs instead of
                                            becoming waste.
                                        </p>

                                        <button
                                            onClick={() => {
                                                setShowFoodForm(true);
                                                setShowFoods(false);
                                                setShowRequests(false);
                                            }}
                                        >
                                            Add Food →
                                        </button>

                                    </div>

                                </div>


                                <div className="food-promo-card">

                                    <div className="food-promo-image food-image-two">
    <img
        src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
        alt="Healthy meal"
    />
</div>

                                    <div className="food-promo-content">

                                        <span className="food-category">
                                            FOOD LISTINGS
                                        </span>

                                        <h3>
                                            Manage your meals
                                        </h3>

                                        <p>
                                            View your available
                                            donations and monitor
                                            their current status.
                                        </p>

                                        <button
                                            onClick={handleViewFoods}
                                        >
                                            View Listings →
                                        </button>

                                    </div>

                                </div>


                                <div className="food-promo-card">

<div className="food-promo-image food-image-three">
    <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
        alt="Food donation"
    />
</div>

                                    <div className="food-promo-content">

                                        <span className="food-category">
                                            NGO REQUESTS
                                        </span>

                                        <h3>
                                            Help an NGO today
                                        </h3>

                                        <p>
                                            Review donation requests
                                            and respond to NGOs.
                                        </p>

                                        <button
                                            onClick={handleViewRequests}
                                        >
                                            View Requests →
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </section>
                    )}


                    {/* ADD FOOD */}
                    {showFoodForm && (

                        <section className="dashboard-content-card">

                            <div className="content-card-header">

                                <div>
                                    <span>FOOD MANAGEMENT</span>

                                    <h2>
                                        Add Food Listing
                                    </h2>
                                </div>

                                <button
                                    className="close-button"
                                    onClick={() =>
                                        setShowFoodForm(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>


                            <form
                                onSubmit={handleAddFood}
                                className="professional-food-form"
                            >

                                <div className="form-row">

                                    <div className="dashboard-form-group">

                                        <label>
                                            Food Name
                                        </label>

                                        <input
                                            type="text"
                                            value={foodName}
                                            onChange={(e) =>
                                                setFoodName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: Vegetable Rice"
                                            required
                                        />

                                    </div>


                                    <div className="dashboard-form-group">

                                        <label>
                                            Quantity
                                        </label>

                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: 25"
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="dashboard-form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe the food, serving size, freshness, etc."
                                        required
                                    />

                                </div>


                                <div className="dashboard-form-group">

                                    <label>
                                        Expiry Date
                                    </label>

                                    <input
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) =>
                                            setExpiryDate(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-submit-area">

                                <button
    type="submit"
    className="primary-action"
>
    {editingFoodId ? "✏️ Update Food" : "➕ Add Food Listing"}
</button>
                                </div>

                            </form>

                            {foodMessage && (
                                <div className="success-message">
                                    {foodMessage}
                                </div>
                            )}

                        </section>
                    )}


                    {/* FOOD LISTINGS */}
                    {showFoods && (

                        <section className="dashboard-content-card">

                            <div className="content-card-header">

                                <div>
                                    <span>
                                        YOUR DONATIONS
                                    </span>

                                    <h2>
                                        Food Listings
                                    </h2>
                                </div>

                                <button
                                    className="primary-action"
                                    onClick={() => {
                                        setShowFoodForm(true);
                                        setShowFoods(false);
                                    }}
                                >
                                    + Add Food
                                </button>

                            </div>


                            {foods.length === 0 ? (

                                <div className="empty-state">
                                    <div>🍽️</div>

                                    <h3>
                                        No food listings yet
                                    </h3>

                                    <p>
                                        Add your first surplus food
                                        listing to get started.
                                    </p>
                                </div>

                            ) : (

                                <div className="food-list-grid">

                                    {foods.map((food) => (

                                        <div
                                            className="professional-food-card"
                                            key={food._id}
                                        >

                                            <div className="food-card-image">
                                                {food.foodName
                                                    ?.toLowerCase()
                                                    .includes("rice")
                                                    ? "🍚"
                                                    : food.foodName
                                                        ?.toLowerCase()
                                                        .includes("dal")
                                                        ? "🥘"
                                                        : "🍱"}
                                            </div>

                                            <div className="food-card-body">

                                                <div className="food-card-top">

                                                    <h3>
                                                        {food.foodName}
                                                    </h3>

                                                    <span
                                                        className={`status-badge ${food.status}`}
                                                    >
                                                        {food.status}
                                                    </span>

                                                </div>

                                                <p>
                                                    {food.description}
                                                </p>

                                                <div className="food-card-details">

                                                    <span>
                                                        📦 {food.quantity} servings
                                                    </span>

                                                    <span>
                                                        📅{" "}
                                                        {new Date(
                                                            food.expiryDate
                                                        ).toLocaleDateString()}
                                                    </span>

                                                </div>
                                                <div className="food-card-actions">

   <button
    className="edit-food-button"
    onClick={() => handleEditFood(food)}
>
    ✏️ Edit
</button>

   <button
    className="delete-food-button"
    onClick={() => {
    console.log("DELETE CLICKED:", food._id);
    handleDeleteFood(food._id);
}}
>
    🗑️ Delete
</button>

</div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>
                    )}


                    {/* DONATION REQUESTS */}
                    {showRequests && (

                        <section className="dashboard-content-card">

                            <div className="content-card-header">

                                <div>
                                    <span>
                                        NGO ACTIVITY
                                    </span>

                                    <h2>
                                        Donation Requests
                                    </h2>
                                </div>

                                <div className="request-count">
                                    {requests.length} Requests
                                </div>

                            </div>


                            {requests.length === 0 ? (

                                <div className="empty-state">

                                    <div>🤝</div>

                                    <h3>
                                        No donation requests
                                    </h3>

                                    <p>
                                        NGO requests will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="request-list">

                                    {requests.map((request) => (

                                        <div
                                            className="request-card"
                                            key={request._id}
                                        >

                                            <div className="request-food-icon">
                                                🍱
                                            </div>

                                            <div className="request-info">

                                                <h3>
                                                    {request.food?.foodName}
                                                </h3>

                                                <p>
                                                    NGO:{" "}
                                                    <strong>
                                                        {request.ngo?.name}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Email:{" "}
                                                    {request.ngo?.email}
                                                </p>

                                                <span>
                                                    Quantity:{" "}
                                                    {request.food?.quantity}
                                                </span>

                                            </div>


                                            <div className="request-actions">

                                                <span
                                                    className={`status-badge ${request.status}`}
                                                >
                                                    {request.status}
                                                </span>

                                                {request.status ===
                                                    "pending" && (

                                                    <div>

                                                        <button
                                                            className="approve-button"
                                                            onClick={() =>
                                                                handleRequestStatus(
                                                                    request._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            ✓ Approve
                                                        </button>

                                                        <button
                                                            className="reject-button"
                                                            onClick={() =>
                                                                handleRequestStatus(
                                                                    request._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            ✕ Reject
                                                        </button>

                                                    </div>
                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                            {requestMessage && (
                                <div className="success-message">
                                    {requestMessage}
                                </div>
                            )}

                        </section>
                    )}

                </main>

            </div>

        </div>
    );
}

    // NGO DASHBOARD
    if (loggedIn && role === "ngo") {
        return (
             
<div className="ngo-dashboard">

    <aside className="ngo-sidebar">

        <div className="ngo-sidebar-brand">
            <div className="ngo-sidebar-logo">
                🍴
            </div>

            <div>
                <strong>FoodBridge</strong>
                <span>NGO Portal</span>
            </div>
        </div>

        <nav className="ngo-sidebar-nav">

            <button
                onClick={() => {
                    setShowAvailableFoods(false);
                    setShowNgoRequests(false);
                }}
            >
                🏠
                <span>Dashboard</span>
            </button>

            <button onClick={handleViewAvailableFood}>
                🍱
                <span>Available Food</span>
            </button>

            <button onClick={handleViewNgoRequests}>
                📋
                <span>My Requests</span>
            </button>

        </nav>

    </aside>

    <main className="ngo-main-content">

    <div className="ngo-header">
    <div>
        <h1>FoodBridge</h1>
        <p>NGO Partner Dashboard</p>
    </div>

   <div className="ngo-header-actions">

    <button
        className="ngo-notification-button"
        onClick={() =>
            setShowNgoNotifications(!showNgoNotifications)
        }
        title="Notifications"
    >
        🔔

        <span className="ngo-notification-count">
            3
        </span>
      </button>

    {showNgoNotifications && (
        <div className="ngo-notification-dropdown">

            <div className="ngo-notification-header">
                <strong>Notifications</strong>

                <button
                    onClick={() =>
                        setShowNgoNotifications(false)
                    }
                >
                    ✕
                </button>
            </div>

            <div className="ngo-notification-item">
                <div className="ngo-notification-icon">
                    🍱
                </div>

                <div>
                    <strong>New food available</strong>
                    <p>New surplus food has been listed.</p>
                    <span>Recently</span>
                </div>
            </div>

            <div className="ngo-notification-item">
                <div className="ngo-notification-icon">
                    📋
                </div>

                <div>
                    <strong>Request update</strong>
                    <p>Your donation request status has changed.</p>
                    <span>Recently</span>
                </div>
            </div>

            <div className="ngo-notification-item">
                <div className="ngo-notification-icon">
                    ❤️
                </div>

                <div>
                    <strong>FoodBridge impact</strong>
                    <p>Thank you for helping reduce food waste.</p>
                    <span>Recently</span>
                </div>
            </div>

        </div>
    )}

    <div className="ngo-online-status">
    <span></span>
    Online
</div>

<div className="ngo-profile">
   <div className="ngo-profile-avatar">
    {userName?.charAt(0)?.toUpperCase() || "N"}
</div>

<div className="ngo-profile-info">
    <strong>{userName || "NGO Partner"}</strong>
    <span>NGO</span>
</div>

    <button
        className="ngo-logout-button"
        onClick={handleLogout}
    >
        Logout
    </button>
</div>

</div>

</div>

<div className="ngo-welcome-section">
    <div>
        <h2>Welcome back, {userName || "NGO Partner"}! 👋</h2>
        <p>
            Find surplus food donations and help make a difference in your community.
        </p>
    </div>

    <div className="ngo-welcome-icon">
        🤝
    </div>
</div>
            <div className="ngo-stats">

    <div
    className="ngo-stat-card ngo-clickable"
    onClick={handleViewAvailableFood}
>
    <div className="ngo-stat-icon">🍱</div>

    <div>
        <h3>Available Food</h3>
        <p>Browse donations</p>
    </div>
</div>

   <div
    className="ngo-stat-card ngo-clickable"
    onClick={handleViewNgoRequests}
>
    <div className="ngo-stat-icon">📋</div>

    <div>
        <h3>My Requests</h3>
        <p>Track your requests</p>
    </div>
</div></div>
               <div className="ngo-impact-section">

    <div className="ngo-impact-heading">
        <div>
            <h3>Our Impact</h3>
            <p>Your contribution helps reduce food waste and support communities.</p>
        </div>
    </div>

    <div className="ngo-impact-grid">

        <div className="ngo-impact-card">
            <div className="ngo-impact-icon">
                🍱
            </div>

            <div>
                <strong>{availableFoods.length}</strong>
                <span>Food Listings</span>
            </div>
        </div>

        <div className="ngo-impact-card">
            <div className="ngo-impact-icon">
                📋
            </div>

            <div>
                <strong>{ngoRequests.length}</strong>
                <span>Requests Submitted</span>
            </div>
        </div>

        <div className="ngo-impact-card">
            <div className="ngo-impact-icon">
                🤝
            </div>

            <div>
                <strong>
                    {
                        ngoRequests.filter(
                            (request) =>
                                request.status === "approved"
                        ).length
                    }
                </strong>
                <span>Requests Approved</span>
            </div>
        </div>

        <div className="ngo-impact-card">
            <div className="ngo-impact-icon">
                ❤️
            </div>

            <div>
                <strong>
                    {
                        ngoRequests.filter(
                            (request) =>
                                request.status === "completed"
                        ).length
                    }
                </strong>
                <span>Completed Donations</span>
            </div>
        </div>

    </div>

</div>

               {showAvailableFoods && (
    <div className="ngo-section">

        <div className="ngo-section-heading">
            <div>
                <h3>Available Food</h3>
                <p>Fresh surplus food available for donation</p>
            </div>

            <span className="ngo-food-count">
                {availableFoods.length} Listings
            </span>
        </div>
        <div className="ngo-food-search">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search food..."
        value={ngoFoodSearch}
        onChange={(e) =>
            setNgoFoodSearch(e.target.value)
        }
    />
</div>

        {availableFoods.length === 0 ? (
            <div className="ngo-empty-state">
                <div className="ngo-empty-icon">🍱</div>
                <h4>No food listings available</h4>
                <p>Please check again later for new surplus food donations.</p>
            </div>
        ) : (
            <div className="ngo-food-grid">

     {availableFoods
    .filter((food) =>
        food.foodName
            .toLowerCase()
            .includes(ngoFoodSearch.toLowerCase())
    ).length === 0 ? (

    <div className="ngo-empty-state">
        <div className="ngo-empty-icon">🔍</div>

        <h4>No matching food found</h4>

        <p>
            Try searching for a different food item.
        </p>
    </div>

) : (

    availableFoods
        .filter((food) =>
            food.foodName
                .toLowerCase()
                .includes(ngoFoodSearch.toLowerCase())
        )
        .map((food) => (

                    <div
                        className="ngo-food-card"
                        key={food._id}
                    >

                        <div className="ngo-food-image">
                            <img
                                src={
                                    food.foodName
                                        .toLowerCase()
                                        .includes("rice")
                                        ? "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
                                        : "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
                                }
                                alt={food.foodName}
                            />

                            <span className="ngo-available-badge">
                                Available
                            </span>
                        </div>

                        <div className="ngo-food-content">

                            <div className="ngo-food-title-row">
                                <h4>{food.foodName}</h4>

                                <span className="ngo-food-quantity">
                                    {food.quantity}
                                </span>
                            </div>

                            <p className="ngo-food-description">
                                {food.description}
                            </p>

                            <div className="ngo-food-details">

                                <div>
                                    <span>🍽️</span>
                                    <strong>Restaurant</strong>
                                    <p>{food.restaurant?.name || "Restaurant"}</p>
                                </div>

                                <div>
                                    <span>📅</span>
                                    <strong>Expiry</strong>
                                    <p>
                                        {new Date(
                                            food.expiryDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                            </div>

                            <button
                                className="ngo-request-food-button"
                                onClick={() =>
                                    handleRequestFood(food._id)
                                }
                            >
                                🤝 Request Food
                            </button>

                        </div>

                    </div>

                            ))
            )}
            </div>
        )}

    </div>
)}

                {showNgoRequests && (
                    <div className="ngo-section">

                        <h3>My Request History</h3>

                        {ngoRequests.length === 0 ? (
                            <p>
                                No donation requests found.
                            </p>
                        ) : (
                            ngoRequests.map((request) => (
    <div
        key={request._id}
        className="ngo-request-history-card"
    >

        <div className="ngo-request-history-top">

            <h4>
                {request.food?.foodName ||
                    "Food listing no longer available"}
            </h4>

            <span
                className={`ngo-request-status status-${request.status}`}
            >
                {request.status}
            </span>

        </div>

        <div className="ngo-request-history-info">

            <div>
                <span>Quantity</span>
                <strong>
                    {request.food?.quantity || "N/A"}
                </strong>
            </div>

            <div>
                <span>Restaurant</span>
                <strong>
                    {request.restaurant?.name || "N/A"}
                </strong>
            </div>

            <div>
                <span>Restaurant Email</span>
                <strong>
                    {request.restaurant?.email || "N/A"}
                </strong>
            </div>

        </div>

    </div>
))
                        )}

                    </div>
                )}

                <p>{ngoMessage}</p>

        
</main>
</div>
    );
}

// ADMIN DASHBOARD
if (loggedIn && role === "admin") {
    return (
        <div className="admin-dashboard">

            {/* TOP HEADER */}
            <div className="admin-topbar">

                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        🍴
                    </div>

                    <div>
                        <h1>FoodBridge</h1>
                        <p>Admin Control Center</p>
                    </div>
                </div>

                <div className="admin-topbar-actions">

                   <button
    className="admin-notification-button"
    onClick={() =>
        setShowAdminNotifications(!showAdminNotifications)
    }
    title="Notifications"
>
    🔔
    <span className="admin-notification-count">
        3
    </span>
</button>{showAdminNotifications && (
    <div className="admin-notification-dropdown">

        <div className="admin-notification-header">
            <strong>Notifications</strong>

            <button
                onClick={() =>
                    setShowAdminNotifications(false)
                }
            >
                ✕
            </button>
        </div>

        <div className="admin-notification-item">

            <div className="admin-notification-icon">
                🏪
            </div>

            <div>
                <strong>Restaurant activity</strong>
                <p>
                    New restaurant partners are registered.
                </p>
                <span>Recently</span>
            </div>

        </div>

        <div className="admin-notification-item">

            <div className="admin-notification-icon">
                🤝
            </div>

            <div>
                <strong>NGO activity</strong>
                <p>
                    New NGO partners have joined FoodBridge.
                </p>
                <span>Recently</span>
            </div>

        </div>

        <div className="admin-notification-item">

            <div className="admin-notification-icon">
                📋
            </div>

            <div>
                <strong>Donation request</strong>
                <p>
                    A new donation request requires monitoring.
                </p>
                <span>Recently</span>
            </div>

        </div>

    </div>
)}

                    <div className="admin-online-status">
                        <span></span>
                        Online
                    </div>

                    <div className="admin-profile">

                        <div className="admin-profile-avatar">
                            A
                        </div>

                        <div className="admin-profile-info">
                            <strong>Administrator</strong>
                            <span>Admin</span>
                        </div>

                        <button
                            className="admin-logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>


            {/* WELCOME SECTION */}
            <div className="admin-welcome">

                <div>
                    <p className="admin-welcome-label">
                        ADMINISTRATION
                    </p>

                    <h2>
                        Welcome back, Admin! 👋
                    </h2>

                    <p>
                        Monitor FoodBridge activities and manage
                        restaurants, NGOs, food listings and donation
                        requests from one place.
                    </p>
                </div>

                <div className="admin-welcome-icon">
                    📊
                </div>

            </div>


            {/* PAGE TITLE */}
            <div className="admin-page-heading">

                <div>
                    <h2>Dashboard Overview</h2>
                    <p>
                        Manage and monitor the FoodBridge platform.
                    </p>
                </div>

            </div>


            {/* STAT CARDS */}
            <div className="admin-stats">

                <div
                    className="admin-stat-card admin-clickable"
                    onClick={handleViewRestaurants}
                >
                    <div className="admin-stat-icon">
                        🏪
                    </div>

                    <div>
                        <h3>Restaurants</h3>
                        <strong>
                            {restaurants.length}
                        </strong>
                        <p>Registered partners</p>
                    </div>
                </div>


                <div
                    className="admin-stat-card admin-clickable"
                    onClick={handleViewNgos}
                >
                    <div className="admin-stat-icon">
                        🤝
                    </div>

                    <div>
                        <h3>NGOs</h3>
                        <strong>
                            {ngos.length}
                        </strong>
                        <p>Registered organizations</p>
                    </div>
                </div>


                <div
                    className="admin-stat-card admin-clickable"
                    onClick={handleViewAdminFoods}
                >
                    <div className="admin-stat-icon">
                        🍱
                    </div>

                    <div>
                        <h3>Food Listings</h3>
                        <strong>
                            {adminFoods.length}
                        </strong>
                        <p>Surplus food listings</p>
                    </div>
                </div>


                <div
                    className="admin-stat-card admin-clickable"
                    onClick={handleViewAdminRequests}
                >
                    <div className="admin-stat-icon">
                        📋
                    </div>

                    <div>
                        <h3>Requests</h3>
                        <strong>
                            {adminRequests.length}
                        </strong>
                        <p>Donation requests</p>
                    </div>
                </div>

            </div>


            {/* MANAGEMENT CARDS */}
            <div className="admin-management-grid">

                <div
                    className="admin-management-card"
                    onClick={handleViewRestaurants}
                >
                    <div className="admin-management-icon">
                        🏪
                    </div>

                    <div className="admin-management-content">
                        <h3>Restaurant Management</h3>

                        <p>
                            View registered restaurants and
                            their account information.
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewRestaurants();
                            }}
                        >
                            View Restaurants →
                        </button>
                    </div>
                </div>


                <div
                    className="admin-management-card"
                    onClick={handleViewNgos}
                >
                    <div className="admin-management-icon">
                        🤝
                    </div>

                    <div className="admin-management-content">
                        <h3>NGO Management</h3>

                        <p>
                            View registered NGOs participating
                            in FoodBridge.
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewNgos();
                            }}
                        >
                            View NGOs →
                        </button>
                    </div>
                </div>


                <div
                    className="admin-management-card"
                    onClick={handleViewAdminFoods}
                >
                    <div className="admin-management-icon">
                        🍱
                    </div>

                    <div className="admin-management-content">
                        <h3>Food Listings</h3>

                        <p>
                            Monitor surplus food listed by
                            restaurant partners.
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewAdminFoods();
                            }}
                        >
                            View Food →
                        </button>
                    </div>
                </div>


                <div
                    className="admin-management-card"
                    onClick={handleViewAdminRequests}
                >
                    <div className="admin-management-icon">
                        📋
                    </div>

                    <div className="admin-management-content">
                        <h3>Donation Requests</h3>

                        <p>
                            Monitor requests between NGOs
                            and restaurants.
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewAdminRequests();
                            }}
                        >
                            View Requests →
                        </button>
                    </div>
                </div>

            </div>


            {/* RESTAURANTS */}
            {showRestaurants && (
                <div className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <h3>Restaurants</h3>
                            <p>
                                Registered restaurant partners
                            </p>
                        </div>

                        <span className="admin-section-count">
                            {restaurants.length} Restaurants
                        </span>

                    </div>
                    <div className="admin-search-box">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search restaurants..."
        value={restaurantSearch}
        onChange={(e) =>
            setRestaurantSearch(e.target.value)
        }
    />
</div>

                    {restaurants.length === 0 ? (
                        <div className="admin-empty-state">
                            <div>🏪</div>
                            <h4>No restaurants found</h4>
                        </div>
                    ) : (
                        <div className="admin-user-grid">

                            {restaurants
    .filter((restaurant) =>
        restaurant.name
            .toLowerCase()
            .includes(restaurantSearch.toLowerCase())
    )
    .map((restaurant) => (
                                <div
                                    className="admin-user-card"
                                    key={restaurant._id}
                                >

                                    <div className="admin-user-avatar">
                                        {restaurant.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "R"}
                                    </div>

                                    <div className="admin-user-content">

                                        <h4>
                                            {restaurant.name}
                                        </h4>

                                        <p>
                                            📧 {restaurant.email}
                                        </p>

                                        <span className="admin-role-badge restaurant-role">
                                            Restaurant
                                        </span>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            )}


            {/* NGOs */}
            {showNgos && (
                <div className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <h3>NGOs</h3>
                            <p>
                                Registered NGO partners
                            </p>
                        </div>

                        <span className="admin-section-count">
                            {ngos.length} NGOs
                        </span>

                    </div>
                    <div className="admin-search-box">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search NGOs..."
        value={ngoSearch}
        onChange={(e) =>
            setNgoSearch(e.target.value)
        }
    />
</div>

                    {ngos.length === 0 ? (
                        <div className="admin-empty-state">
                            <div>🤝</div>
                            <h4>No NGOs found</h4>
                        </div>
                    ) : (
                        <div className="admin-user-grid">

                            {ngos
    .filter((ngo) =>
        ngo.name
            .toLowerCase()
            .includes(ngoSearch.toLowerCase())
    )
    .map((ngo) => (
                                <div
                                    className="admin-user-card"
                                    key={ngo._id}
                                >

                                    <div className="admin-user-avatar">
                                        {ngo.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "N"}
                                    </div>

                                    <div className="admin-user-content">

                                        <h4>
                                            {ngo.name}
                                        </h4>

                                        <p>
                                            📧 {ngo.email}
                                        </p>

                                        <span className="admin-role-badge ngo-role">
                                            NGO
                                        </span>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            )}


            {/* FOOD LISTINGS */}
            {showAdminFoods && (
                <div className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <h3>Food Listings</h3>
                            <p>
                                Monitor all surplus food listings
                            </p>
                        </div>

                        <span className="admin-section-count">
                            {adminFoods.length} Listings
                        </span>

                    </div>
                    <div className="admin-search-box">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search food..."
        value={foodSearch}
        onChange={(e) =>
            setFoodSearch(e.target.value)
        }
    />
</div>

                    {adminFoods.length === 0 ? (
                        <div className="admin-empty-state">
                            <div>🍱</div>
                            <h4>No food listings found</h4>
                        </div>
                    ) : (
                        <div className="admin-food-grid">

                           {adminFoods
    .filter((food) =>
        food.foodName
            .toLowerCase()
            .includes(foodSearch.toLowerCase())
    )
    .map((food) => (
                                <div
                                    className="admin-food-card"
                                    key={food._id}
                                >

                                    <div className="admin-food-image">
                                        <img
                                            src={
                                                food.foodName
                                                    ?.toLowerCase()
                                                    .includes("rice")
                                                    ? "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
                                                    : "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
                                            }
                                            alt={food.foodName}
                                        />

                                        <span className="admin-food-status">
                                            {food.status}
                                        </span>
                                    </div>

                                    <div className="admin-food-content">

                                        <div className="admin-food-title-row">

                                            <h4>
                                                {food.foodName}
                                            </h4>

                                            <span>
                                                {food.quantity}
                                            </span>

                                        </div>

                                        <p>
                                            {food.description}
                                        </p>

                                        <div className="admin-food-info">

                                            <div>
                                                <span>Restaurant</span>
                                                <strong>
                                                    {food.restaurant?.name ||
                                                        "Restaurant"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Expiry</span>
                                                <strong>
                                                    {new Date(
                                                        food.expiryDate
                                                    ).toLocaleDateString()}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            )}


            {/* DONATION REQUESTS */}
            {showAdminRequests && (
                <div className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <h3>Donation Requests</h3>
                            <p>
                                Monitor all NGO food requests
                            </p>
                        </div>

                        <span className="admin-section-count">
                            {adminRequests.length} Requests
                        </span>

                    </div>
                    <div className="admin-search-box">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search donation requests..."
        value={requestSearch}
        onChange={(e) =>
            setRequestSearch(e.target.value)
        }
    />
</div>

                    {adminRequests.length === 0 ? (
                        <div className="admin-empty-state">
                            <div>📋</div>
                            <h4>No donation requests found</h4>
                        </div>
                    ) : (
                        <div className="admin-request-list">

                            {adminRequests
    .filter((request) =>
        request.food?.foodName
            ?.toLowerCase()
            .includes(requestSearch.toLowerCase())
    )
    .map((request) => (
                                <div
                                    className="admin-request-card"
                                    key={request._id}
                                >

                                    <div className="admin-request-icon">
                                        📋
                                    </div>

                                    <div className="admin-request-main">

                                        <h4>
                                            {request.food?.foodName ||
                                                "Food listing unavailable"}
                                        </h4>

                                        <p>
                                            NGO:{" "}
                                            <strong>
                                                {request.ngo?.name ||
                                                    "N/A"}
                                            </strong>
                                        </p>

                                        <p>
                                            Restaurant:{" "}
                                            <strong>
                                                {request.restaurant?.name ||
                                                    "N/A"}
                                            </strong>
                                        </p>

                                    </div>

                                    <div className="admin-request-meta">

                                        <span
                                            className={`admin-request-status status-${request.status}`}
                                        >
                                            {request.status}
                                        </span>

                                        <span>
                                            Quantity:{" "}
                                            {request.food?.quantity ||
                                                "N/A"}
                                        </span>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

    // REGISTER PAGE
    if (showRegister) {
        return (
            <div className="register-page">

                <nav className="navbar">

                    <div className="navbar-logo">
                        🍴 FoodBridge
                    </div>

                    <div className="navbar-links">

                        <button
                            onClick={() =>
                                setShowHome(true)
                            }
                        >
                            Home
                        </button>

                        <button>
                            How It Works
                        </button>

                        <button>
                            About
                        </button>

                    </div>

                </nav>

                <div className="register-card">

                    <div className="logo-circle">
                        🍴
                    </div>

                    <h1>
                        FoodBridge
                    </h1>

                    <p className="tagline">
                        Join us in reducing food waste
                    </p>

                    <h2>
                        Create Account
                    </h2>

                    <form onSubmit={handleRegister}>

                        <div className="form-group">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={registerName}
                                onChange={(e) =>
                                    setRegisterName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your name"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={registerEmail}
                                onChange={(e) =>
                                    setRegisterEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={registerPassword}
                                onChange={(e) =>
                                    setRegisterPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Account Type
                            </label>

                            <select
                                value={registerRole}
                                onChange={(e) =>
                                    setRegisterRole(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="restaurant">
                                    Restaurant
                                </option>

                                <option value="ngo">
                                    NGO
                                </option>

                            </select>

                        </div>

                        <button
                            type="submit"
                            className="login-button"
                        >
                            Create Account
                        </button>

                    </form>

                    <p className="register-text">
                        Already have an account?
                    </p>

                    <button
                        onClick={() => {
                            setShowRegister(false);
                            setRegisterMessage("");
                        }}
                        className="register-button"
                    >
                        Back to Login
                    </button>

                    <p className="message">
                        {registerMessage}
                    </p>

                </div>

            </div>
        );
    }

    // LOGIN PAGE
    return (
        <div className="login-page">

            <nav className="navbar">

                <div className="navbar-logo">
                    🍴 FoodBridge
                </div>

                <div className="navbar-links">

                    <button
                        onClick={() =>
                            setShowHome(true)
                        }
                    >
                        Home
                    </button>

                    <button>
                        How It Works
                    </button>

                    <button>
                        About
                    </button>

                </div>

            </nav>

            <div className="login-card">

                <div className="logo-circle">
                    🍴
                </div>

                <h1>
                    FoodBridge
                </h1>

                <p className="tagline">
                    Connecting Food with Those in Need
                </p>

                <h2>
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?
                </p>

                <button
                    onClick={() =>
                        setShowRegister(true)
                    }
                    className="register-button"
                >
                    Create New Account
                </button>

                <p className="message">
                    {message}
                </p>

            </div>

        </div>
    );
}

export default App;