# TaskMaster - MERN Task Management Application

A modern, full-stack Task Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- **Full Authentication**: Register, Login, Logout with JWT and bcrypt.
- **Dashboard**: Real-time stats (Total, Pending, In Progress, Completed, High Priority).
- **Task CRUD**: Create, read, update, and delete tasks.
- **Advanced Filtering**: Search by title, filter by status/priority, and sort by due date/date created.
- **Responsive Design**: Optimized for Desktop (Table view) and Mobile (Card view).
- **Premium UI**: Glassmorphism effects, smooth animations, and a modern color palette.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Lucide React, React Router.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT.
- **State Management**: React Context API.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd TaskManagementSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
/backend
  /config      - Database connection
  /controllers - Request handlers
  /middleware  - Auth & Error handling
  /models      - Mongoose schemas
  /routes      - API endpoints
/frontend
  /src
    /components - Reusable UI components
    /context    - Auth state management
    /pages      - Main application pages
    /services   - API service calls
    /assets     - Static files
```

## 🛡️ Security Features

- Password hashing with bcrypt.
- Protected API routes using JWT middleware.
- Input validation on both frontend and backend.
- Global error handling.
