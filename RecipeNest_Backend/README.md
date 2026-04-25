# RecipeNest - Backend 🛠️

This is the Node.js/Express API for the RecipeNest application, using MongoDB for data persistence.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Running locally or on Atlas)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipenest
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

### Running the Server
- Development: `npm run dev` (using nodemon)
- Production: `npm start`

## 🛠️ Tech Stack
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **BcryptJS** for Password Hashing
- **Multer** for Image Uploads
- **Cors** for Cross-Origin Resource Sharing

## 🛣️ API Endpoints
- `/api/auth`: Authentication (Login/Register)
- `/api/recipes`: Recipe CRUD operations
- `/api/admin`: Administrative management
- `/api/categories`: Category management
- `/api/reviews`: Ratings and reviews
- `/api/chef`: Chef-specific analytics and management
- `/api/notifications`: User notifications
- `/api/messages`: Direct messaging logic

## 📁 Directory Structure
- `controllers/`: Logic for handling API requests.
- `models/`: Mongoose schemas for data structure.
- `routes/`: Express route definitions.
- `middleware/`: Custom middleware (auth, file uploads).
- `uploads/`: Directory for stored recipe images.
