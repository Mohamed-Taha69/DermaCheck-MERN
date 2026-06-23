# 🩺 DermaCheck AI

A modern, AI-powered web application for skin disease detection and analysis. Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), TypeScript, and integrated with advanced AI technology. Detect Monkeypox, Chickenpox, Measles, and Normal skin conditions with medical-grade image analysis.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)

## ✨ Features

- 🔍 **AI-Powered Skin Disease Detection** - Upload skin images for instant detection of Monkeypox, Chickenpox, Measles, and Normal skin conditions.
- 🦠 **Multi-Disease Classification** - Automatic detection and classification of multiple skin diseases.
- 📝 **Medical Reports** - Detailed assessments with key features and personalized recommendations.
- 📊 **Confidence Scores** - Get confidence levels for each diagnosis.
- 👤 **User Authentication** - Secure custom authentication built with JWT (JSON Web Tokens) and Express sessions.
- 📈 **History Tracking** - View and track your skin analysis history over time, saved directly to MongoDB.
- 💾 **Cloud Storage** - Secure and robust medical image hosting via Cloudinary.
- 🎨 **Modern UI** - Beautiful, responsive design built with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend (`/Client`)
- **React 19.2.0** & **TypeScript** - UI and type safety.
- **Vite** - High-performance build tool.
- **Tailwind CSS** - Modern responsive styling.
- **Lucide React** - Vector icons.

### Backend (`/Server`)
- **Node.js** & **Express.js** - Robust REST API backend framework.
- **MongoDB** & **Mongoose** - NoSQL Database for storing user profiles, history, and medical data templates.
- **Cloudinary** - Cloud storage service for hosting uploaded skin images safely.
- **AI Service Integration** - Dedicated wrapper (`aiService.ts`) to query the AI model and retrieve diagnostic data.

---

## 📁 Project Structure

Based on the current project structure:

```
DermaCheck-MERN/
├── Client/               # React Frontend (Vite + TypeScript)
└── Server/               # Node.js + Express Backend
    ├── src/
    │   ├── config/       # db.ts (MongoDB), cloudinary.ts
    │   ├── controllers/  # auth, history, profile, scan controllers
    │   ├── data/         # medicalData.ts (Local templates/fallbacks)
    │   ├── middleware/   # upload.ts (Multer), auth middleware
    │   ├── models/       # History.ts, Profile.ts, User.ts (Mongoose)
    │   ├── routes/       # auth, history, profile, scan routes
    │   └── services/     # aiService.ts (Handles AI prediction logic)
    └── uploads/          # Temporary local uploads directory
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Cloudinary Account** (For image upload API keys)

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Mohamed-Taha69/dermacheck-ai.git
cd DermaCheck-MERN
```

### 2. Setup Backend Server (`/Server`)
```bash
cd Server
npm install
```
Create a `.env` file inside the `Server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend Client (`/Client`)
Open a new terminal window, then:
```bash
cd Client
npm install
```
Create a `.env` file inside the `Client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the frontend dev server:
```bash
npm run dev
```
The application will be running at `http://localhost:3000` (or `5173` depending on Vite settings).

---

## 🔧 Backend API Endpoints

The Express server handles the following main endpoints under `/api`:
- `POST /auth/register` & `POST /auth/login` - Custom JWT User Authentication.
- `POST /scan` - Process image via Multer -> Upload to Cloudinary -> Feed to AI Model.
- `GET /history/:user_id` - Fetch logged scan history from MongoDB.
- `GET /profile/:user_id` & `PUT /profile/update` - Manage user information.

---

## 🔒 Security Considerations

- **Environment Protection:** Never commit `.env` files to Git. Keep them excluded through `.gitignore`.
- **Password Hashing:** Passwords are fully hashed using `bcrypt` before storing them in MongoDB.
- **Token Security:** Secure storage and delivery of JWTs for protected API routes.

## ⚠️ Medical Disclaimer

**This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.**

---
**Built with ❤️ for better skin health awareness using the MERN Stack**