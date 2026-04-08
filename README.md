# Buy Nexa - E-Commerce Platform

A modern, full-stack e-commerce application built with React and Express.js. Buy Nexa is a fast grocery and essentials delivery platform offering various product categories with real-time cart management, order tracking, and user authentication.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Application Flow](#application-flow)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)

---

## 🎯 Project Overview

**Buy Nexa** is a full-stack e-commerce platform that enables users to:

- Browse and search across various product categories
- Add items to cart with real-time updates
- Place orders and track their status
- Manage user profiles and order history
- User authentication with JWT tokens

The application follows a **client-server architecture** with a **React-based frontend** and **Express-based REST API backend**, connected to a **MySQL database**.

---

## 🛠 Tech Stack

### Frontend

- **React 19.1.1** - UI framework
- **Vite 7.1.14** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Zustand 5.0.11** - State management (Context API)
- **Axios 1.13.1** - HTTP client for API calls
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Lucide React 0.548.0** - Icon library
- **React Toastify 11.0.5** - Toast notifications
- **ESLint 9.36.0** - Code linting

### Backend

- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MySQL2 3.15.3** - Database driver
- **JWT (jsonwebtoken 9.0.2)** - Authentication & authorization
- **Bcrypt/Bcryptjs** - Password hashing
- **Multer 2.0.2** - File upload handling
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variables
- **Morgan 1.10.1** - HTTP logging middleware
- **Nodemon** - Development auto-restart

### Database

- **MySQL** - Relational database for storing users, products, and orders

---

## 📁 Project Structure

```
buy_nexa/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── user.controller.js    # User management
│   │   │   ├── order.controller.js   # Order operations
│   │   │   ├── homeProducts.controller.js
│   │   │   ├── productPage.controller.js
│   │   │   └── about.controller.js
│   │   ├── middleware/
│   │   │   ├── authorization.js      # JWT verification
│   │   │   ├── handleLogin.js        # Login handler
│   │   │   ├── fetchUser.js          # User fetching
│   │   │   └── errorHandler.js       # Global error handling
│   │   ├── routes/
│   │   │   ├── user.routes.js        # User endpoints
│   │   │   ├── order.routes.js       # Order endpoints
│   │   │   ├── homeProducts.routes.js
│   │   │   ├── products.routes.js
│   │   │   └── about.routes.js
│   │   ├── utils/
│   │   │   └── response.js           # Response formatting
│   │   ├── uploads/
│   │   │   └── home_page_products/   # Uploaded product images
│   │   ├── app.js                    # Express app setup
│   │   ├── server.js                 # Server entry point
│   │   ├── database.sql              # Database schema
│   │   └── microservices_schema.sql  # Microservices schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navigation
│   │   │   ├── ProductCard.jsx       # Product display card
│   │   │   ├── ProductDescription.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── CancelOrderModal.jsx
│   │   │   ├── OrderModal.jsx
│   │   │   ├── CartNotification.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Cart.jsx              # Shopping cart
│   │   │   ├── OrderHistory.jsx      # User orders
│   │   │   ├── Account.jsx           # User profile
│   │   │   ├── Category.jsx          # Category browsing
│   │   │   ├── SearchResults.jsx     # Search results
│   │   │   ├── TrackOrder.jsx        # Order tracking
│   │   │   ├── Register.jsx          # Registration
│   │   │   └── [Other category pages]
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── store/
│   │   │   ├── useCartStore.js       # Cart state (Zustand)
│   │   │   ├── useOrderStore.js      # Order state
│   │   │   ├── useProductStore.js    # Product state
│   │   │   └── useUserStore.js       # User state
│   │   ├── services/
│   │   │   ├── productService.js     # Product API calls
│   │   │   ├── userService.js        # User API calls
│   │   │   └── orderService.js       # Order API calls
│   │   ├── utils/
│   │   │   └── api.js                # Axios configuration
│   │   ├── assets/                   # Product category images
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   └── global.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md (this file)
```

---

## ✨ Features

### 🛒 Shopping Features

- **Product Browsing** - Browse products by category
- **Product Search** - Search for specific products
- **Product Details** - View detailed product information
- **Shopping Cart** - Add/remove items, real-time updates
- **Quantity Management** - Adjust item quantities in cart

### 🧑 User Management

- **User Registration** - Create new user accounts
- **User Login** - Secure login with JWT authentication
- **Profile Management** - View and update user profile
- **Account Dashboard** - Personal account information

### 📦 Order Management

- **Place Orders** - Create and place orders from cart
- **Order History** - View all user orders
- **Order Tracking** - Track order status in real-time
- **Order Cancellation** - Cancel orders before delivery

### 🔐 Security

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Protected Routes** - Authorization middleware for sensitive endpoints
- **CORS Protection** - Cross-origin resource sharing

---

## 🔄 Application Flow

### User Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Register   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ POST /api/user/register      │
│ - Validate email             │
│ - Hash password (bcrypt)     │
│ - Store in database          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│  Login Page  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ POST /api/user/login         │
│ - Verify credentials         │
│ - Generate JWT tokens        │
│ - Return tokens              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Store JWT in Cookies         │
│ Set Authentication Header    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│ Home Page    │
│ (Protected)  │
└──────────────┘
```

### Shopping & Order Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   SHOPPING & ORDER FLOW                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Browse Home │
│  / Category  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ GET /api/products/           │
│ - Fetch product list         │
│ - Display in ProductCard     │
│ - Show category options      │
└──────┬───────────────────────┘
       │
       ▼ (User clicks product)
┌──────────────────────────────┐
│ Product Details Page         │
│ GET /api/products/:id        │
│ - Load product specs         │
│ - Show reviews               │
│ - Display price              │
└──────┬───────────────────────┘
       │
       ▼ (Add to cart)
┌──────────────────────────────┐
│ Update Cart State (Zustand)  │
│ - Add item                   │
│ - Update quantity            │
│ - Toast notification         │
└──────┬───────────────────────┘
       │
       ▼ (View cart)
┌──────────────────────────────┐
│ Cart Page                    │
│ - Review items               │
│ - Modify quantities          │
│ - Calculate total            │
└──────┬───────────────────────┘
       │
       ▼ (Proceed to checkout)
┌──────────────────────────────┐
│ POST /api/orders/place       │
│ - Validate cart items        │
│ - Create order record        │
│ - Clear cart                 │
│ - Return order ID            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Order Confirmation           │
│ - Display order details      │
│ - Show order ID              │
│ - Provide tracking link      │
└──────┬───────────────────────┘
       │
       ▼ (Track order)
┌──────────────────────────────┐
│ GET /api/orders/:orderId     │
│ - Fetch order status         │
│ - Display delivery timeline  │
│ - Show tracking info         │
└──────────────────────────────┘
```

### Data Flow Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Pages      │    │ Components   │    │   Layout     │ │
│  │ (Home, Cart, │    │ (Navbar,     │    │ (Wrapper)    │ │
│  │  Orders)     │    │  ProductCard)│    │              │ │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘ │
│         │                   │                   │          │
│         └───────────────────┼───────────────────┘          │
│                             │                              │
│         ┌───────────────────┼───────────────────┐          │
│         │                   │                   │          │
│  ┌──────▼─────────┐ ┌──────▼────────┐ ┌─────▼────────┐  │
│  │  AuthContext   │ │  Zustand      │ │   Services   │  │
│  │  (Auth State)  │ │  (Global      │ │   (API)      │  │
│  │                │ │   State)      │ │              │  │
│  └──────┬─────────┘ └──────┬────────┘ └─────┬────────┘  │
│         │                  │                 │           │
│         └──────────────────┼─────────────────┘           │
│                            │                             │
│         ┌──────────────────▼──────────────────┐          │
│         │   Axios HTTP Client                │          │
│         │   (API calls to backend)            │          │
│         └──────────────────┬──────────────────┘          │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             │
                    (HTTP/HTTPS)
                             │
┌────────────────────────────▼─────────────────────────────┐
│                    BACKEND (Express.js)                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────┐               │
│  │        Routes (/api/...)               │               │
│  │ /user, /products, /orders              │               │
│  └────────────────┬───────────────────────┘               │
│                  │                                         │
│  ┌───────────────▼──────────────┐                         │
│  │     Middleware                │                         │
│  │ - Authorization (JWT)         │                         │
│  │ - Error Handling              │                         │
│  │ - CORS, Logging               │                         │
│  └───────────────┬──────────────┘                         │
│                  │                                         │
│  ┌───────────────▼──────────────┐                         │
│  │     Controllers               │                         │
│  │ - Business Logic              │                         │
│  │ - Request Processing          │                         │
│  └───────────────┬──────────────┘                         │
│                  │                                         │
│  ┌───────────────▼──────────────┐                         │
│  │     Database (MySQL)          │                         │
│  │ - Users                       │                         │
│  │ - Products                    │                         │
│  │ - Orders                      │                         │
│  └───────────────────────────────┘                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### User Management Endpoints

| Method | Endpoint                  | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| POST   | `/api/user/register`      | Register new user        | ❌   |
| POST   | `/api/user/login`         | User login               | ❌   |
| POST   | `/api/user/refresh-token` | Refresh JWT token        | ❌   |
| GET    | `/api/user/profile`       | Get current user profile | ✅   |
| PUT    | `/api/user/profile`       | Update user profile      | ✅   |
| POST   | `/api/user/logout`        | Logout user              | ✅   |

### Product Endpoints

| Method | Endpoint                           | Description              | Auth |
| ------ | ---------------------------------- | ------------------------ | ---- |
| GET    | `/api/products/`                   | Get all products         | ❌   |
| GET    | `/api/products/:id`                | Get product details      | ❌   |
| GET    | `/api/products/category/:category` | Get products by category | ❌   |

### Order Endpoints

| Method | Endpoint                      | Description              | Auth |
| ------ | ----------------------------- | ------------------------ | ---- |
| POST   | `/api/orders/place`           | Create new order         | ✅   |
| GET    | `/api/orders/history`         | Get user's order history | ✅   |
| GET    | `/api/orders/:orderId`        | Get order details        | ✅   |
| PUT    | `/api/orders/:orderId/cancel` | Cancel an order          | ✅   |

**Auth Legend:** ✅ = JWT Required | ❌ = Public

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file:**

   ```env
   PORT=5000
   DEV_MODE=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=buy_nexa
   JWT_SECRET=your_jwt_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. **Setup MySQL Database:**
   ```bash
   mysql -u root -p < src/database.sql
   ```

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

Server runs on: `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173` (Vite default)

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Build output in dist/ directory
```

---

## 📦 State Management

### **Zustand Stores** (Frontend)

- **useCartStore** - Shopping cart items and operations
- **useProductStore** - Product data and filtering
- **useOrderStore** - Order history and tracking
- **useUserStore** - User profile and preferences

### **AuthContext** (Frontend)

- User authentication state
- JWT token management
- Login/logout operations

---

## 🔐 Security Features

1. **JWT Authentication** - Secure API access
2. **Password Hashing** - Bcrypt for secure storage
3. **Protected Routes** - Middleware-based authorization
4. **CORS Protection** - Controlled cross-origin access
5. **HTTP-Only Cookies** - JWT stored securely

---

## 📝 Environment Variables

### Backend (`.env`)

```
PORT=5000
DEV_MODE=development/production
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=buy_nexa
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
UPLOAD_PATH=./uploads
```

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Backend Issues

- **Database connection fails:** Verify MySQL is running and credentials are correct
- **Port already in use:** Change PORT in `.env` or kill process using the port
- **JWT errors:** Ensure secrets in `.env` are set correctly

### Frontend Issues

- **API calls fail:** Check if backend is running on correct port
- **Styles not loading:** Run `npm run build` to rebuild CSS
- **Authentication issues:** Clear browser cookies and localStorage

---

## 📚 Additional Resources

- **React**: https://react.dev
- **Express**: https://expressjs.com
- **React Router**: https://reactrouter.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Contributing

Feel free to fork this repository and submit pull requests for any improvements.

---

**Last Updated:** April 2026  
**Project Status:** Active Development
