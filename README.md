# Gymze 💪

## 🎯 Project Overview
AI-powered gym companion that detects equipment and creates personalized workouts through video analysis.

## 🚀 Development Phases

### 1. Authentication System 🔐
- Next.js project setup
- Login/Signup UI
- MongoDB integration
- JWT authentication

### 2. Security Implementation🛡️
- Token management
- Environment configuration
- Authentication middleware

### 3. Core UI Development🎨
- Dynamic navbar
- Profile management
- Location switching

### 4. Video Processing System📹
- Gym location management
- Video upload integration
- Fast API connection

### 5. Cloud Integration ☁️
- Cloudinary setup for video storage
- MongoDB data management
- Fast API queue system

### 6. AI Model Development 🤖
- YOLOv8 custom model
- 400 image dataset annotation
- Model training (60-70% accuracy)

### 7. Equipment Detection 🔍
- Flask API integration
- MongoDB equipment storage
- Response handling

### 8. Profile Management 👤
- User profile creation
- Equipment data visualization
- Location management

### 9. Workout Generation 💪
- Dashboard implementation
- Gemini Pro API integration
- Personalized routine generation

## ⚙️ Installation Guide

## 📦 Installation

1. Clone the repository: 📥
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
