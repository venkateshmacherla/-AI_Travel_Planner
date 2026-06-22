# AI Travel Planner

## Project Overview

AI Travel Planner is a full-stack web application that helps users generate personalized travel itineraries using Artificial Intelligence. Users can create accounts, log in securely, provide trip preferences such as destination, budget, duration, and interests, and receive a complete AI-generated travel plan including daily itineraries, hotel recommendations, budget estimates, and travel tips.

The goal of this project is to simplify travel planning by leveraging Generative AI to create customized trip experiences within seconds.

---

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### Authentication

- JWT (JSON Web Token)
- bcryptjs

### AI Integration

- Google Gemini API (Gemini 2.5 Flash)

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Why This Tech Stack?

- **Next.js** provides modern React development, routing, and performance optimizations.
- **TypeScript** improves code quality and maintainability.
- **MongoDB** offers flexibility for storing AI-generated travel data.
- **Express.js** provides a lightweight and scalable backend architecture.
- **Gemini AI** enables intelligent itinerary generation with natural language understanding.

---

## Setup Instructions

### Local Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd AI_Travel_Planner
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Application will run on:

```text
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

---

## Deployed Application

### Frontend

Vercel Deployment URL:
https://ai-travel-planner-rosy-alpha.vercel.app/

### Backend

Render Deployment URL:
https://ai-travel-planner-tgcz.onrender.com

---

## High-Level Architecture

```text
User
 │
 ▼
Next.js Frontend
 │
 ▼
Express API Server
 │
 ├── Authentication Module
 ├── Trip Management Module
 ├── AI Planning Module
 │
 ▼
MongoDB Atlas
 │
 ▼
Gemini AI API
```

### Architecture Flow

1. User submits trip details.
2. Frontend sends request to backend.
3. Backend validates user authentication.
4. Gemini AI generates travel itinerary.
5. Generated response is structured and stored in MongoDB.
6. Frontend displays itinerary to the user.

---

## Authentication and Authorization

### Authentication

The application uses JWT-based authentication.

Process:

1. User registers an account.
2. Password is hashed using bcryptjs.
3. User logs in with email and password.
4. Backend generates a JWT token.
5. Token is stored in browser localStorage.
6. Token is attached to every protected API request.

### Authorization

Protected routes require a valid JWT token.

Examples:

- Create Trip
- View Trips
- Delete Trip
- Modify Itinerary
- Regenerate Day Plans

Unauthorized users cannot access these features.

---

## AI Agent Design and Purpose

### Purpose

The AI Travel Planning Agent generates personalized travel plans based on user preferences.

### Inputs

- Destination
- Duration
- Budget
- Interests

### Outputs

- Trip Summary
- Day-wise Itinerary
- Budget Estimation
- Hotel Recommendations
- Travel Tips

### Design Approach

Prompt engineering is used to guide Gemini AI to return structured JSON responses. The backend cleans and validates responses before storing them in MongoDB.

This ensures consistency, reliability, and easier frontend rendering.

---

## Custom Feature (Creativity Requirement)

### Personalized User Welcome Experience

A custom feature was added to improve user experience by displaying the logged-in user's name within the dashboard navigation bar.

Example:

```text
Welcome, Venkatesh 👋
```

### Problem Solved

Many travel applications feel generic after login.

By personalizing the dashboard experience:

- Users feel recognized.
- Navigation feels more engaging.
- The application appears more professional and user-friendly.

### Engineering Consideration

User information is stored after authentication and displayed dynamically without requiring additional API calls, improving performance and reducing unnecessary requests.

---

## Key Design Decisions and Trade-Offs

### Decision 1: JWT Authentication

Pros:

- Stateless authentication
- Easy deployment
- Scalable

Trade-Off:

- Token revocation requires additional handling.

---

### Decision 2: MongoDB Database

Pros:

- Flexible schema
- Easy storage of AI-generated content

Trade-Off:

- Less strict schema enforcement compared to relational databases.

---

### Decision 3: Gemini AI Integration

Pros:

- Fast itinerary generation
- Rich travel recommendations

Trade-Off:

- AI output can occasionally vary and requires validation.

---

### Decision 4: Client-Side Token Storage

Pros:

- Simple implementation
- Faster development

Trade-Off:

- More secure approaches such as HTTP-only cookies could be implemented in production environments.

---

## Known Limitations

1. AI-generated travel recommendations may occasionally vary in quality.
2. No offline support is currently available.
3. Token storage uses localStorage instead of HTTP-only cookies.
4. Travel costs are estimated and may not reflect real-time pricing.
5. Hotel recommendations are AI-generated and not connected to live booking services.

---

## Future Improvements

- Favorite Trips Feature
- PDF Export of Itineraries
- Real-Time Weather Integration
- Live Hotel and Flight APIs
- User Profile Management
- Collaborative Trip Planning
- Multi-Language Support

---

## Author

Venkatesh Macharla

Full Stack Developer

Built as part of the AI Travel Planner Assessment Project.
