# RecipeNest

RecipeNest is a comprehensive full-stack recipe management and sharing platform. It features a multi-role system designed for Administrators, Chefs, and Users, providing a seamless experience for discovering, creating, and managing culinary delights.

## Features

### For Users
- **Discover Recipes**: Browse a wide variety of recipes across different categories.
- **Detailed View**: Access ingredients, step-by-step instructions, and cooking times.
- **Ratings & Reviews**: Share feedback and rate recipes.
- **User Profile**: Manage personal information and saved recipes.

### For Chefs
- **Recipe Management**: Create, edit, and delete personal recipes.
- **Dashboard**: Track recipe performance and engagement.
- **Notifications**: Stay updated on reviews and interactions.
- **Direct Messaging**: Communicate within the platform.

### For Administrators
- **User Management**: Oversee all users and chef accounts.
- **Category Control**: Create and manage recipe categories.
- **Analytics**: View platform-wide statistics and growth metrics.
- **Content Moderation**: Ensure the quality and safety of shared content.

---

## Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Routing**: React Router DOM
- **Charts**: [Recharts](https://recharts.org/)
- **Feedback**: React Hot Toast
- **HTTP Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **File Uploads**: Multer
- **Environment Management**: Dotenv

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RecipeNest
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd RecipeNest_Backend
npm install
```

Create a `.env` file in the `RecipeNest_Backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipenest
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../RecipeNest_Frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`. 

---

## Project Structure

```text
RecipeNest/
├── RecipeNest_Backend/       # Node.js/Express API
│   ├── controllers/          # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth & upload logic
│   ├── uploads/              # Stored recipe images
│   └── server.js             # Entry point
└── RecipeNest_Frontend/      # React application
    ├── src/
    │   ├── components/       # Reusable UI elements
    │   ├── pages/            # View components (Admin, Chef, User)
    │   ├── context/          # State management
    │   └── assets/           # Static files
    └── index.html            # Entry HTML
```

