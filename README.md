# Gymze

An AI-powered gym companion that transforms your workout experience by automatically detecting available equipment and creating personalized routines based on your gym's facilities.

## 🎯 Purpose

As someone who frequents different gyms (apartment, work, college), I found it challenging to adapt workouts based on available equipment. Gymze solves this by:
- Automatically detecting gym equipment through video uploads
- Creating personalized workout routines based on available equipment
- Managing multiple gym locations efficiently
- Tracking fitness progress across different locations

## ✨ Core Features

- **Smart Gym Detection**
  - Video-based equipment recognition
  - AI-powered equipment analysis
  - Multiple location management
  
- **Personalized Workouts**
  - Custom routine generation
  - Equipment-based exercise suggestions
  - Workout history tracking

- **Location Management**
  - Multiple gym profiles
  - Equipment inventory per location
  - Quick location switching

## 🛠 Tech Stack

- **Frontend**
  - Next.js
  - Tailwind CSS
  - JWT Authentication
  
- **Backend**
  - Node.js/Express.js
  - MongoDB
  - Flask (AI Processing API)

- **AI/ML**
  - Computer Vision for equipment detection
  - Machine Learning for workout personalization

## 🚀 Current Development Progress

### Phase 1: Authentication System ✅
- User signup/login UI implementation
- MongoDB integration for user management
- JWT token implementation
- Error handling and validation

### Phase 2: Security & Configuration ✅
- Middleware implementation
- Token expiration handling
- Environment variable configuration
- Authentication flow completion

### Phase 3: Core UI Components ✅
- Navigation bar with dynamic auth state
- User profile management
- Gym location switching interface
- Logout functionality

### Phase 4: Location Management ✅
- Gym location management interface
- Video upload system
- Integration with Flask API for processing
- Location switching functionality

### Upcoming Phases 🚧
- Equipment detection AI implementation
- Workout routine generation
- Progress tracking system
- Diet monitoring features

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/dipeshpandit12/gymze.git

```
## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```properties
// /gymze/.env

# MongoDB Configuration
MONGODB_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=your_api_url

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

```
