# 🌿 HabitFlow — Turn Habits into Momentum 

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

> **HabitFlow** is a full-stack software engineering project designed to help users build and maintain daily routines. Built with a focus to offer a distraction-free, highly performant environment for tracking habits, visualizing consistency, and managing personal growth.

*(Note: Add a beautiful screenshot of y our Dashboard here!)*
<!-- ![HabitFlow Dashboard](./screenshots/dashboard.png) -->

## ✨ Technical Highlights

I built this project to demonstrate end-to-end full-stack capabilities, focusing on clean architecture, secure authentication, and user experience.

- **Robust Authentication**: Implemented a dual-auth system using **Google OAuth 2.0** (`google-auth-library` & `@react-oauth/google`) and secure local Email/Password auth via **bcryptjs** and **JWT**.

- **Complex State Management**: Leveraged React Context API (`AuthContext`, `HabitContext`) to cleanly manage user sessions, real-time habit updates, and dynamic UI states without prop drilling.

- **Data Visualization**: Integrated **Recharts** to render dynamic, real-time consistency trends and category distributions based on real user completion data.

- **Advanced UI/UX**: Designed a design system using **Tailwind CSS**. Features custom cursors, smooth scroll (Lenis), and highly optimized **Framer Motion** micro-interactions.

- **RESTful API Design**: Built a highly modular **Express/Node.js** backend utilizing **Mongoose** for schema validation, pre-save hooks (password hashing), and relational data querying.

## 🚀 Features

- **Google OAuth Integration**: One-click "Continue with Google" sign-in with secure session handling and profile sync.

- **Dashboard Analytics**: Real-time progress tracking, consistency trends, focus summaries, and habit health indicators.

- **Habit Management System**: Full CRUD for habits including title, category, duration, frequency, streaks, and completion tracking.

- **Weekly & Monthly Views**: Dedicated views for tracking routine adherence over different time ranges with calendar-like and trend-based insights.

- **Smart Habit Insights**: Smart recommendations, habit suggestions, and actionable guidance based on user consistency and streak patterns.

- **Category-based Organization**: Group habits by category, visualize category distribution, and filter by habit type.

- **Advanced Filtering & Search**: Quickly find habits by search term, status, or category without losing context.

- **Schedule Planning**: Daily and structured scheduling support to help users place habits and tasks in realistic time blocks.

- **Profile & Settings Pages**: Personalization features for user configuration, habit management preferences, and account state.

- **Protected Routing**: Secure access control with `ProtectedRoute` and `PublicOnlyRoute` wrappers to enforce authenticated or guest-only flows.

- **Responsive UI**: A polished, mobile-friendly interface built with Tailwind and modern motion effects for a user experience.

- **Progress Tracking & Streak Logic**: Completion states, streak-based motivation, and habit momentum analysis to reinforce consistency.

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Auth**: `@react-oauth/google`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JSON Web Tokens (JWT), bcryptjs, `google-auth-library`

## 🛠️ Local Development Setup

To run this project locally, you will need Node.js and a MongoDB cluster.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/habitflow.git
cd habitflow
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set your local `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_CLIENT_ID` values in `backend/.env` before starting the server. Never commit `.env` files.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` before starting the frontend. Never commit `.env` files.

### Contact
```bash
Designed and engineered by Kaushiki Tripathi
Email: kaushikitripathi07@gmail.com
```
