# 🎯 Habit Tracker - Full Stack App

A beautiful and functional habit tracking application with user authentication, built with React, Node.js, Express, and MongoDB Atlas.

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- ✅ **Habit Management** - Add, check-in, and delete habits
- 🔥 **Streak Tracking** - Automatically calculates consecutive day streaks
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- ☁️ **Cloud Storage** - Your habits are safely stored in MongoDB Atlas
- 📱 **Responsive Design** - Works great on desktop and mobile

## 🛠️ Tech Stack

**Frontend:**

- React 18
- Vite
- CSS3 (with gradients and animations)

**Backend:**

- Node.js
- Express
- MongoDB Atlas with Mongoose
- JWT for authentication
- bcrypt for password hashing

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB Atlas Account** (free) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login
2. Create a new cluster (free M0 tier is perfect)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/`)
6. Replace `<password>` with your actual database password
7. Add your database name after `.net/` (e.g., `habittracker`)

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create/Edit the `.env` file with your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**Important:** Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string!

4. Start the backend server:

```bash
npm run dev
```

You should see:

```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### 3. Frontend Setup

1. Open a **new terminal** (keep the backend running) and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

4. Open your browser and go to: **http://localhost:5173/**

## 🎮 How to Use

### First Time Users

1. **Register an Account**
    - Click "Register" tab
    - Enter a username, email, and password (min 6 characters)
    - Click "Create Account"

2. **Add Your First Habit**
    - Enter a habit name (e.g., "Drink 8 glasses of water")
    - Click "+ Add Habit"

3. **Track Your Progress**
    - Click "Mark as Done" when you complete a habit for the day
    - Watch your streak counter increase! 🔥
    - The card turns green when checked for today

4. **Manage Habits**
    - Click the ✕ button to delete a habit
    - Log out and log back in - your habits are saved in the cloud!

### Streak Logic (Simple & Beginner-Friendly)

- **First check-in:** Streak starts at 1
- **Next day check-in:** Streak increments by 1
- **Same day re-check:** Unchecks the habit, streak resets to 0
- **Missed a day:** Streak resets to 1 on next check-in

## 📁 Project Structure

```
Habit Tracker/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Habit.js         # Habit schema with streak tracking
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server with all routes
│   ├── package.json
│   └── .env                 # Configuration (DO NOT COMMIT)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Styles with gradients
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes

- `POST /auth/register` - Register new user
    - Body: `{ username, email, password }`
- `POST /auth/login` - Login user
    - Body: `{ email, password }`

### Habit Routes (Protected - Requires JWT Token)

- `GET /habits` - Get all habits for logged-in user
- `POST /habits` - Create new habit
    - Body: `{ name }`
- `PUT /habits/:id` - Toggle habit check-in for today
- `DELETE /habits/:id` - Delete habit

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens for secure authentication
- ✅ Protected API routes
- ✅ User-specific habit isolation (users can only see their own habits)
- ✅ CORS enabled for frontend-backend communication

## 🎨 Customization

### Change Colors

Edit `frontend/src/index.css`:

- Main gradient: `#667eea` and `#764ba2` (lines 10, 55, 142, etc.)
- Success color: `#4caf50` (checked habits)
- Streak color: `#ff6f00` (fire emoji background)

### Change Ports

**Backend:** Edit `backend/.env` - change `PORT=5000`

**Frontend:** Edit `frontend/vite.config.js` - change `port: 5173`

## 🐛 Troubleshooting

**Backend won't start:**

- Make sure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for testing)
- Check if your connection string is correct in `.env`
- Verify Node.js is installed: `node --version`

**Frontend can't connect to backend:**

- Make sure backend is running on port 5000
- Check if `API_URL` in `App.jsx` matches your backend URL

**"Invalid token" errors:**

- Try logging out and logging back in
- Clear browser localStorage

## 📝 Future Enhancements (Optional Ideas)

- 📊 Weekly/monthly statistics dashboard
- 🏆 Achievement badges
- 📅 Calendar view of habit history
- 👥 Social features (share progress with friends)
- 📱 Native mobile app
- 🌙 Dark mode

## 📄 License

This project is open source and available for learning purposes.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**

Happy habit tracking! 🚀
