import { useState } from "react";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
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

    // Admin
    const [restaurants, setRestaurants] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [adminFoods, setAdminFoods] = useState([]);
    const [adminRequests, setAdminRequests] = useState([]);

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
            <div>

                <h1>FoodBridge</h1>

                <h2>NGO Dashboard</h2>

                <p>Welcome, NGO!</p>

                <button onClick={handleLogout}>
                    Logout
                </button>

                <button
                    onClick={handleViewAvailableFood}
                >
                    Browse Available Food
                </button>

                <button
                    onClick={handleViewNgoRequests}
                >
                    View Request History
                </button>

                {showAvailableFoods && (
                    <div>

                        <h3>Available Food</h3>

                        {availableFoods.length === 0 ? (
                            <p>
                                No available food listings found.
                            </p>
                        ) : (
                            availableFoods.map((food) => (
                                <div key={food._id}>

                                    <hr />

                                    <h4>
                                        {food.foodName}
                                    </h4>

                                    <p>
                                        Quantity:{" "}
                                        {food.quantity}
                                    </p>

                                    <p>
                                        Description:{" "}
                                        {food.description}
                                    </p>

                                    <p>
                                        Expiry Date:{" "}
                                        {new Date(
                                            food.expiryDate
                                        ).toLocaleDateString()}
                                    </p>

                                    <p>
                                        Restaurant:{" "}
                                        {food.restaurant?.name}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleRequestFood(
                                                food._id
                                            )
                                        }
                                    >
                                        Request Food
                                    </button>

                                </div>
                            ))
                        )}

                    </div>
                )}

                {showNgoRequests && (
                    <div>

                        <h3>My Request History</h3>

                        {ngoRequests.length === 0 ? (
                            <p>
                                No donation requests found.
                            </p>
                        ) : (
                            ngoRequests.map((request) => (
                                <div key={request._id}>

                                    <hr />

                                    <h4>
                                        {request.food?.foodName}
                                    </h4>

                                    <p>
                                        Quantity:{" "}
                                        {request.food?.quantity}
                                    </p>

                                    <p>
                                        Restaurant:{" "}
                                        {request.restaurant?.name}
                                    </p>

                                    <p>
                                        Restaurant Email:{" "}
                                        {request.restaurant?.email}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {request.status}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                )}

                <p>{ngoMessage}</p>

            </div>
        );
    }

    // ADMIN DASHBOARD
    if (loggedIn && role === "admin") {
        return (
            <div>

                <h1>FoodBridge</h1>

                <h2>Admin Dashboard</h2>

                <p>Welcome, Admin!</p>

                <button onClick={handleLogout}>
                    Logout
                </button>

                <button onClick={handleViewRestaurants}>
                    View Restaurants
                </button>

                <button onClick={handleViewNgos}>
                    View NGOs
                </button>

                <button onClick={handleViewAdminFoods}>
                    View Food Listings
                </button>

                <button onClick={handleViewAdminRequests}>
                    View Donation Requests
                </button>

                {showRestaurants && (
                    <div>

                        <h3>Restaurants</h3>

                        {restaurants.length === 0 ? (
                            <p>
                                No restaurants found.
                            </p>
                        ) : (
                            restaurants.map((restaurant) => (
                                <div
                                    key={restaurant._id}
                                >

                                    <hr />

                                    <h4>
                                        {restaurant.name}
                                    </h4>

                                    <p>
                                        Email:{" "}
                                        {restaurant.email}
                                    </p>

                                    <p>
                                        Role:{" "}
                                        {restaurant.role}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                )}

                {showNgos && (
                    <div>

                        <h3>NGOs</h3>

                        {ngos.length === 0 ? (
                            <p>
                                No NGOs found.
                            </p>
                        ) : (
                            ngos.map((ngo) => (
                                <div key={ngo._id}>

                                    <hr />

                                    <h4>
                                        {ngo.name}
                                    </h4>

                                    <p>
                                        Email:{" "}
                                        {ngo.email}
                                    </p>

                                    <p>
                                        Role:{" "}
                                        {ngo.role}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                )}

                {showAdminFoods && (
                    <div>

                        <h3>All Food Listings</h3>

                        {adminFoods.length === 0 ? (
                            <p>
                                No food listings found.
                            </p>
                        ) : (
                            adminFoods.map((food) => (
                                <div key={food._id}>

                                    <hr />

                                    <h4>
                                        {food.foodName}
                                    </h4>

                                    <p>
                                        Quantity:{" "}
                                        {food.quantity}
                                    </p>

                                    <p>
                                        Restaurant:{" "}
                                        {food.restaurant?.name}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {food.status}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                )}

                {showAdminRequests && (
                    <div>

                        <h3>All Donation Requests</h3>

                        {adminRequests.length === 0 ? (
                            <p>
                                No donation requests found.
                            </p>
                        ) : (
                            adminRequests.map((request) => (
                                <div key={request._id}>

                                    <hr />

                                    <h4>
                                        {request.food?.foodName}
                                    </h4>

                                    <p>
                                        Quantity:{" "}
                                        {request.food?.quantity}
                                    </p>

                                    <p>
                                        NGO:{" "}
                                        {request.ngo?.name}
                                    </p>

                                    <p>
                                        Restaurant:{" "}
                                        {request.restaurant?.name}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {request.status}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                )}

                <p>{adminMessage}</p>

            </div>
        );
    }

    // HOME PAGE
    if (showHome) {
        return (
            <div className="home-page">

                <nav className="navbar">

                    <div className="navbar-logo">
                        🍴 FoodBridge
                    </div>

                    <div className="navbar-links">

                        <button
                            onClick={() =>
                                setShowHome(false)
                            }
                        >
                            Login
                        </button>

                        <button
                            onClick={() => {
                                setShowHome(false);
                                setShowRegister(true);
                            }}
                        >
                            Register
                        </button>

                    </div>

                </nav>

                <section className="hero-section">

                    <div className="hero-content">

                        <p className="hero-small-title">
                            FOOD • COMMUNITY • CHANGE
                        </p>

                        <h1>
                            Share Food.
                            <br />
                            Reduce Waste.
                            <br />
                            <span>
                                Make a Difference.
                            </span>
                        </h1>

                        <p>
                            FoodBridge connects restaurants
                            with NGOs to help surplus food
                            reach people who need it.
                        </p>

                        <button
                            className="hero-button"
                            onClick={() => {
                                setShowHome(false);
                                setShowRegister(true);
                            }}
                        >
                            Get Started
                        </button>

                    </div>

                    <div className="hero-image">

                        <img
                            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
                            alt="Fresh food"
                            className="hero-food-image"
                        />

                    </div>

                </section>

                <section className="features-section">

                    <h2>
                        How FoodBridge Works
                    </h2>

                    <p className="section-subtitle">
                        A simple way to connect surplus food
                        with NGOs.
                    </p>

                    <div className="feature-cards">

                        <div className="feature-card">

                            <div className="feature-icon">
                                🍽️
                            </div>

                            <h3>
                                Restaurants
                            </h3>

                            <p>
                                List surplus food that can
                                be donated instead of going
                                to waste.
                            </p>

                        </div>

                        <div className="feature-card">

                            <div className="feature-icon">
                                🤝
                            </div>

                            <h3>
                                NGOs
                            </h3>

                            <p>
                                Browse available food and
                                send donation requests.
                            </p>

                        </div>

                        <div className="feature-card">

                            <div className="feature-icon">
                                ❤️
                            </div>

                            <h3>
                                Make an Impact
                            </h3>

                            <p>
                                Help reduce food waste and
                                support communities in need.
                            </p>

                        </div>

                    </div>

                </section>

                <footer className="home-footer">

                    <p>
                        © 2026 FoodBridge | Connecting Food
                        with Those in Need
                    </p>

                </footer>

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