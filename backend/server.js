import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Habit from "./models/Habit.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://habit-tracker-livid-zeta.vercel.app",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow server-to-server or Postman requests
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(
                new Error(`CORS blocked for origin ${origin}`),
                false,
            );
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Use the same CORS config for all routes and preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handles preflight requests

app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==================== AUTH ROUTES ====================

// Register
app.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
});

// Login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
});

// ==================== HABIT ROUTES (Protected) ====================

// Get all habits for logged-in user
app.get("/habits", authenticateToken, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.userId }).sort({
            createdAt: -1,
        });
        res.json(habits);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching habits",
            error: error.message,
        });
    }
});

// Create new habit
app.post("/habits", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const habit = new Habit({
            name,
            userId: req.user.userId,
        });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({
            message: "Error creating habit",
            error: error.message,
        });
    }
});

// Toggle habit (mark as done/undone for today)
app.put("/habits/:id", authenticateToken, async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastChecked = habit.lastChecked
            ? new Date(habit.lastChecked)
            : null;

        if (lastChecked) {
            lastChecked.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor(
                (today - lastChecked) / (1000 * 60 * 60 * 24),
            );

            if (daysDiff === 0) {
                // Same day - uncheck (reset streak)
                habit.lastChecked = null;
                habit.streak = 0;
            } else if (daysDiff === 1) {
                // Consecutive day - increment streak
                habit.lastChecked = new Date();
                habit.streak += 1;
            } else {
                // Broke streak - reset to 1
                habit.lastChecked = new Date();
                habit.streak = 1;
            }
        } else {
            // First time checking
            habit.lastChecked = new Date();
            habit.streak = 1;
        }

        await habit.save();
        res.json(habit);
    } catch (error) {
        res.status(500).json({
            message: "Error updating habit",
            error: error.message,
        });
    }
});

// Delete habit
app.delete("/habits/:id", authenticateToken, async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting habit",
            error: error.message,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
