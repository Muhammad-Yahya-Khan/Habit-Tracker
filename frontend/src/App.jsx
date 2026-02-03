import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [user, setUser] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Habit states
    const [habits, setHabits] = useState([]);
    const [newHabitName, setNewHabitName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
            fetchHabits(token);
        }
    }, []);

    // ==================== AUTH FUNCTIONS ====================

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setIsLoggedIn(true);
            fetchHabits(data.token);
            setFormData({ username: "", email: "", password: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setIsLoggedIn(true);
            fetchHabits(data.token);
            setFormData({ username: "", email: "", password: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        setHabits([]);
        setFormData({ username: "", email: "", password: "" });
    };

    // ==================== HABIT FUNCTIONS ====================

    const fetchHabits = async (token = localStorage.getItem("token")) => {
        try {
            const response = await fetch(`${API_URL}/habits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setHabits(data);
            }
        } catch (err) {
            console.error("Error fetching habits:", err);
        }
    };

    const addHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        try {
            const response = await fetch(`${API_URL}/habits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name: newHabitName }),
            });

            if (response.ok) {
                setNewHabitName("");
                fetchHabits();
            }
        } catch (err) {
            console.error("Error adding habit:", err);
        }
    };

    const toggleHabit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/habits/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                fetchHabits();
            }
        } catch (err) {
            console.error("Error toggling habit:", err);
        }
    };

    const deleteHabit = async (id) => {
        if (!confirm("Are you sure you want to delete this habit?")) return;

        try {
            const response = await fetch(`${API_URL}/habits/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                fetchHabits();
            }
        } catch (err) {
            console.error("Error deleting habit:", err);
        }
    };

    const isCheckedToday = (lastChecked) => {
        if (!lastChecked) return false;
        const today = new Date();
        const checked = new Date(lastChecked);
        return today.toDateString() === checked.toDateString();
    };

    // ==================== RENDER ====================

    if (!isLoggedIn) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h1 className="app-title">🎯 Habit Tracker</h1>
                    <p className="subtitle">
                        Build better habits, one day at a time
                    </p>

                    <div className="auth-toggle">
                        <button
                            className={!isRegistering ? "active" : ""}
                            onClick={() => {
                                setIsRegistering(false);
                                setError("");
                            }}
                        >
                            Login
                        </button>
                        <button
                            className={isRegistering ? "active" : ""}
                            onClick={() => {
                                setIsRegistering(true);
                                setError("");
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <form
                        onSubmit={isRegistering ? handleRegister : handleLogin}
                    >
                        {isRegistering && (
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                minLength="3"
                            />
                        )}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength="6"
                        />

                        {error && <div className="error-message">{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : isRegistering
                                  ? "Create Account"
                                  : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main habits dashboard
    return (
        <div className="app-container">
            <header className="header">
                <div className="header-content">
                    <h1>🎯 My Habits</h1>
                    <div className="user-info">
                        <span>
                            Hello, <strong>{user?.username}</strong>
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="add-habit-section">
                    <form onSubmit={addHabit} className="add-habit-form">
                        <input
                            type="text"
                            placeholder="New habit (e.g., Drink 8 glasses of water)"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            maxLength="50"
                        />
                        <button type="submit" className="btn-add">
                            + Add Habit
                        </button>
                    </form>
                </div>

                <div className="habits-grid">
                    {habits.length === 0 ? (
                        <div className="empty-state">
                            <p>📝 No habits yet! Add your first habit above.</p>
                        </div>
                    ) : (
                        habits.map((habit) => (
                            <div
                                key={habit._id}
                                className={`habit-card ${isCheckedToday(habit.lastChecked) ? "checked" : ""}`}
                            >
                                <div className="habit-header">
                                    <h3>{habit.name}</h3>
                                    <button
                                        onClick={() => deleteHabit(habit._id)}
                                        className="btn-delete"
                                        title="Delete habit"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="habit-stats">
                                    <div className="streak">
                                        <span className="streak-icon">🔥</span>
                                        <span className="streak-count">
                                            {habit.streak}
                                        </span>
                                        <span className="streak-label">
                                            day streak
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleHabit(habit._id)}
                                    className={`btn-check ${isCheckedToday(habit.lastChecked) ? "checked" : ""}`}
                                >
                                    {isCheckedToday(habit.lastChecked)
                                        ? "✓ Done Today"
                                        : "Mark as Done"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
