# 🩺 DermaCheck AI

A modern, AI-powered web application for skin disease detection and analysis. Built with React, TypeScript, and integrated with a FastAPI backend for medical-grade image analysis. Detect Monkeypox, Chickenpox, Measles, and Normal skin conditions with advanced AI technology.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.39.0-3ECF8E?logo=supabase)

## ✨ Features

- 🔍 **AI-Powered Skin Disease Detection** - Upload skin images for instant detection of Monkeypox, Chickenpox, Measles, and Normal skin conditions
- 🦠 **Multi-Disease Classification** - Automatic detection and classification of multiple skin diseases
- 📝 **Medical Reports** - Detailed assessments with key features and personalized recommendations
- 📊 **Confidence Scores** - Get confidence levels for each diagnosis
- 👤 **User Authentication** - Secure authentication with Supabase
- 📈 **History Tracking** - View and track your skin analysis history over time
- 💾 **Cloud Storage** - Images stored securely in Supabase Storage
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔒 **Secure** - Row-level security and encrypted data storage

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Supabase JS** - Authentication and database

### Backend (Required)
- **FastAPI** - Python web framework
- **Supabase** - Database and storage
- **Gradio Client** - AI model integration (skin disease detection)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **FastAPI Backend** - The backend server must be running (see Backend Setup)
- **Supabase Account** - For authentication and storage

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <https://github.com/Mohamed-Taha69/dermacheck-ai.git>
cd dermacheck-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# FastAPI Backend URL
VITE_API_BASE_URL=http://localhost:8000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ Important Security Note:**
- Use the **anon/public key** for `VITE_SUPABASE_ANON_KEY` (NOT the service_role key)
- Get your keys from: Supabase Dashboard > Settings > API
- The service_role key should ONLY be used in your backend

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Backend Setup

This frontend requires a FastAPI backend to function. The backend should:

1. **Run on port 8000** (or update `VITE_API_BASE_URL` in `.env`)
2. **Have the following endpoints:**
   - `POST /scan` - Analyze skin images
   - `GET /history/{user_id}` - Get user scan history
   - `GET /profile/{user_id}` - Get user profile
   - `PUT /profile/update` - Update user profile
   - `GET /` - Health check

3. **Be configured with:**
   - Supabase connection (for database and storage)
   - Gradio client for AI model inference
   - CORS enabled for `http://localhost:3000`

### Backend API Response Format

The `/scan` endpoint should return:

```json
{
  "status": "success",
  "diagnosis": "Monkeypox" | "Chickenpox" | "Measles" | "Normal",
  "image_url": "https://...",
  "report": {
    "assessment": "Detailed assessment text",
    "key_features": ["feature1", "feature2"],
    "recommendations": ["recommendation1", "recommendation2"]
  }
}
```

### Supported Diseases

The application can detect the following skin conditions:

- **Monkeypox** - A viral disease that can cause skin lesions
- **Chickenpox** - A highly contagious viral infection causing itchy blisters
- **Measles** - A viral infection that can cause skin rashes
- **Normal** - Healthy skin with no detected conditions

## 📁 Project Structure

```
dermacheck-ai/
├── components/          # React components
│   ├── Analyzer.tsx    # Image upload and analysis
│   ├── AuthForms.tsx   # Login/Register forms
│   ├── Navbar.tsx      # Navigation bar
│   ├── Profile.tsx     # User profile and history
│   └── ResultCard.tsx  # Analysis results display
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication state management
├── services/           # API services
│   └── apiService.ts   # Backend API integration
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🎯 Usage

### 1. Create an Account
- Click "Sign Up" or navigate to the register page
- Enter your name, email, and password
- If email confirmation is enabled, check your email

### 2. Analyze Skin Images
- Log in to your account
- Click "Upload Image" or drag and drop an image
- Click "Analyze Now" to process the image
- View detailed results with disease diagnosis, assessment, key features, and personalized recommendations

### 3. View History
- Navigate to "Profile" or "History" from the navbar
- View all your previous scans with timestamps
- See your analysis trends over time

## 🔐 Authentication

The application uses Supabase Authentication with the following features:

- **Email/Password Authentication**
- **Session Management** - Automatic session persistence
- **Secure Storage** - User data stored in Supabase
- **Fallback Mode** - Works with localStorage if Supabase is not configured

## 🐛 Troubleshooting

### "Cannot connect to backend server"
- Ensure your FastAPI backend is running on port 8000
- Check that `VITE_API_BASE_URL` in `.env` matches your backend URL
- Verify CORS is enabled on your backend

### "User already exists" error
- The email might already be registered
- Check Supabase Dashboard > Authentication > Users
- If email confirmation is enabled, check your email inbox
- Try logging in instead of registering

### "Failed to analyze image"
- Ensure you're logged in (authentication required)
- Check that the backend is running and accessible
- Verify Supabase storage is configured in your backend
- Ensure the image shows a clear view of the affected skin area
- Check browser console for detailed error messages

### Images not loading
- Verify Supabase Storage bucket is created and configured
- Check that the backend is uploading images correctly
- Ensure CORS is properly configured for Supabase Storage

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🌐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | FastAPI backend URL | Yes | `http://localhost:8000` |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | - |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes | - |

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security Considerations

- **Never commit `.env` files** - They contain sensitive credentials
- **Use anon key in frontend** - Never use service_role key in client-side code
- **Enable RLS** - Configure Row Level Security in Supabase
- **Validate inputs** - Backend should validate all user inputs
- **HTTPS in production** - Always use HTTPS for production deployments

## 📄 License

This project is private and proprietary.

## ⚠️ Medical Disclaimer

**This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.**

## 🤝 Contributing

This is a private project. For issues or questions, please contact the project maintainer.

## 📞 Support

For support, please:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify backend and Supabase configurations
4. Contact the development team

---

## 🦠 Disease Detection Capabilities

DermaCheck AI uses advanced machine learning models to detect and classify skin conditions:

- **Monkeypox Detection** - Identifies characteristic lesions and symptoms
- **Chickenpox Detection** - Recognizes typical vesicular rash patterns
- **Measles Detection** - Detects distinctive rash characteristics
- **Normal Skin Recognition** - Confirms healthy skin appearance

The AI model provides confidence scores and detailed medical assessments to help users understand their skin condition better.

---

**Built with ❤️ for better skin health awareness**
