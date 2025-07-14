# MindCare - Dynamic Mental Health Support Platform

A full-stack mental health support platform built with React, Node.js, Express, and MongoDB.

## Features

### Dynamic Data Management
- **User Authentication**: JWT-based authentication with role-based access (Patient/Psychiatrist)
- **Dynamic Sessions**: Real-time session management with CRUD operations
- **Resource Library**: Searchable and filterable mental health resources
- **User Profiles**: Comprehensive user management with additional fields

### Enhanced Models
- **Users**: Support for both patients and psychiatrists with specialized fields
- **Sessions**: Booking, scheduling, and session history tracking
- **Resources**: Categorized mental health materials with metadata
- **Real-time Data**: All data is fetched dynamically from MongoDB

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Frontend
- **React** with functional components and hooks
- **Custom API utility functions**
- **Responsive CSS styling**
- **Dynamic data loading with error handling**

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindCare
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/mental-health
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas cloud database
   # Update MONGO_URI in .env file with your Atlas connection string
   ```

6. **Seed the database with sample data**
   ```bash
   cd server
   npm run seed
   ```

7. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Sample Login Credentials

After running the seed script, you can use these credentials:

### Patients
- **Email**: john.doe@email.com | **Password**: password123
- **Email**: alice.smith@email.com | **Password**: password123
- **Email**: mike.wilson@email.com | **Password**: password123

### Psychiatrists
- **Email**: maya.singh@mindcare.com | **Password**: password123
- **Email**: ali.tan@mindcare.com | **Password**: password123
- **Email**: sarah.johnson@mindcare.com | **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update` - Update user profile

### Sessions
- `GET /api/sessions` - Get all sessions for current user
- `GET /api/sessions/upcoming` - Get upcoming sessions
- `POST /api/sessions` - Create new session (psychiatrist only)
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `GET /api/sessions/psychiatrists` - Get all psychiatrists

### Resources
- `GET /api/resources` - Get all resources (with filtering)
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources` - Create new resource (psychiatrist only)
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `POST /api/resources/:id/like` - Like a resource
- `GET /api/resources/meta/categories` - Get resource categories
- `GET /api/resources/meta/types` - Get resource types

## Key Changes Made

### 1. Enhanced Database Models
- **User Model**: Added specialization, license info, emergency contacts
- **Session Model**: Complete session management with status tracking
- **Resource Model**: Rich metadata with categories, tags, difficulty levels

### 2. Dynamic API Integration
- **API Utility**: Centralized API functions in `client/src/utils/api.js`
- **Authentication**: JWT token management
- **Error Handling**: Comprehensive error handling across all components

### 3. Updated Components
- **Resources**: Dynamic filtering, pagination, like functionality
- **Sessions**: Real-time session display with status badges
- **Dashboard**: Dynamic user data, upcoming sessions, resource counts

### 4. Database Seeding
- **Sample Data**: Comprehensive seed script with realistic data
- **Multiple Users**: Both patients and psychiatrists
- **Rich Content**: Resources with proper categorization

## Features Overview

### Dashboard
- **Dynamic Welcome Message**: Shows user's name
- **Upcoming Sessions**: Displays next 3 upcoming sessions
- **Resource Statistics**: Shows total available resources
- **User Profile Info**: Role and membership information

### Sessions Management
- **View All Sessions**: Complete session history
- **Filter Options**: All, Upcoming, Completed
- **Session Details**: Date, time, psychiatrist, duration, status
- **Real-time Updates**: Dynamic status tracking

### Resources Library
- **Filter by Type**: Article, Video, Tool, Guide, Podcast
- **Filter by Category**: Anxiety, Depression, Stress, Self-care, etc.
- **Resource Details**: Title, description, author, duration, difficulty
- **Interaction**: Like resources, view statistics
- **External Links**: Direct access to resource content

## Quick Start

1. **Install dependencies**: `npm install` in both `server` and `client` directories
2. **Set up MongoDB**: Local MongoDB or MongoDB Atlas
3. **Configure environment**: Update `.env` file with your MongoDB URI
4. **Seed database**: Run `npm run seed` in server directory
5. **Start servers**: `npm run dev` (server) and `npm start` (client)
6. **Login**: Use sample credentials to test the application

## Development Notes

- **Authentication**: All API endpoints require JWT tokens except login/register
- **Role-based Access**: Psychiatrists can create resources and sessions
- **Real-time Updates**: Components automatically refresh data
- **Error Handling**: Comprehensive error messages and loading states
- **Responsive Design**: Works on desktop and mobile devices

---

**Note**: This application now uses MongoDB for all data storage with comprehensive models and dynamic API integration. All hardcoded data has been replaced with database-driven content.
