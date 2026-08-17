# Store Rating App

A full-stack web application that allows users to register, browse stores, and submit ratings from **1 to 5 stars**. The application also provides separate dashboards and functionality for **System Administrators, Store Owners, and Normal Users**.

## 🚀 Live Repository

GitHub: https://github.com/parakhchetana005-max/roxiler-store-rating-app

---

## 📌 Project Overview

This project was developed as part of the **Roxiler Full Stack Developer Trainee Coding Challenge**.

The application provides a role-based store rating platform where:

* Users can create accounts and log in.
* Users can browse registered stores.
* Users can submit ratings between 1 and 5.
* Users can update their submitted ratings.
* Store owners can view their store's ratings and average rating.
* Administrators can manage users and stores.
* Administrators can view overall application statistics.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript
* React Router
* Zustand

### Backend

* Node.js
* Express.js
* Sequelize ORM
* REST APIs
* JWT Authentication

### Database

* PostgreSQL

### Other Tools

* Git & GitHub
* npm
* Postman

---

## 👥 User Roles

### 1. System Administrator

Administrators can:

* View dashboard statistics
* Add new users
* View all users
* Filter and search users
* View user details
* Add and manage stores
* View store details
* View store ratings
* Manage application data

### 2. Normal User

Normal users can:

* Register an account
* Log in
* View available stores
* Search stores
* Submit ratings from 1 to 5
* Modify their submitted rating
* Change their password

### 3. Store Owner

Store owners can:

* Log in
* View their store dashboard
* View the average rating of their store
* View ratings submitted by users
* Change their password

---

## ✨ Key Features

* 🔐 JWT-based authentication
* 👤 Role-based access control
* ⭐ Store rating system from 1–5
* 🔄 Update existing ratings
* 🔎 Store search and filtering
* 📊 Admin dashboard
* 👥 User management
* 🏪 Store management
* 📈 Store rating statistics
* 📱 Responsive React interface
* 🔒 Protected API routes
* 🗄️ PostgreSQL database
* 🔄 Database migrations

---

## 📂 Project Structure

```text
Store App/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── migrations/
│   └── database migration files
│
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/parakhchetana005-max/roxiler-store-rating-app.git
cd roxiler-store-rating-app
```

---

## 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

# 🗄️ Database Setup

This application uses **PostgreSQL**.

Create a PostgreSQL database for the application.

Example:

```sql
CREATE DATABASE store_rating_app;
```

Configure the database connection using the environment variables expected by the backend.

Example `.env` configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_app
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
```

> Do not commit your `.env` file to GitHub. A `.gitignore` file is included in the repository to prevent environment files and dependencies from being uploaded.

---

# 🔄 Database Migrations

Run the required migrations from the project root/backend configuration.

```bash
npx sequelize-cli db:migrate
```

If the project configuration uses a different migration command, use the command defined in the backend `package.json`.

---

# ▶️ Running the Application

## Start Backend

From the backend directory:

```bash
cd backend
npm run dev
```

The backend API will start on the configured backend port.

---

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will provide the local frontend URL, usually:

```text
http://localhost:5173
```

---

# 🔑 Authentication

The application uses JWT-based authentication.

After successful login:

1. The user receives an authentication token.
2. The token is used for protected API requests.
3. Access to pages and APIs is controlled based on the user's role.

Supported roles:

```text
ADMIN
USER
OWNER
```

---

# ⭐ Rating System

Users can submit ratings for stores using a scale of:

```text
1 ⭐
2 ⭐⭐
3 ⭐⭐⭐
4 ⭐⭐⭐⭐
5 ⭐⭐⭐⭐⭐
```

A user can modify their previously submitted rating.

Store owners can view the ratings and average rating associated with their stores.

---

# 🔌 API Functionality

The backend provides REST APIs for:

### Authentication

* User registration
* User login
* Password management

### Users

* Create users
* Retrieve users
* Search/filter users
* Retrieve user details

### Stores

* Create stores
* Retrieve stores
* Search/filter stores
* Retrieve store details

### Ratings

* Submit ratings
* Update ratings
* Retrieve store ratings
* Calculate average ratings

All protected endpoints require valid authentication.

---

# 🧪 Testing

The APIs can be tested using tools such as:

* Postman
* Browser
* Frontend application

The frontend provides the main interface for testing the complete application workflow.

---

# 🔐 Security

The project follows basic application security practices including:

* JWT authentication
* Password protection
* Role-based authorization
* Protected routes
* Environment variables for sensitive configuration
* `.gitignore` protection for secrets and dependencies

---

# 📱 Application Pages

The application includes pages for:

### Authentication

* Login
* Signup
* Change Password

### Administrator

* Dashboard
* Users
* User Details
* Stores
* Store Management

### Store Owner

* Dashboard
* Store Ratings

### Normal User

* Store Listing
* Store Search
* Rating Submission

---

# 🎯 Assignment Requirements Covered

The implementation covers the major requirements of the Roxiler Store Rating System:

* [x] User registration
* [x] User authentication
* [x] Role-based access
* [x] Store listing
* [x] Store management
* [x] Rating system
* [x] 1–5 rating scale
* [x] Update rating functionality
* [x] Average store ratings
* [x] Admin dashboard
* [x] User management
* [x] Store owner dashboard
* [x] PostgreSQL database
* [x] REST API architecture
* [x] Responsive frontend

---

# 👩‍💻 Author

**Chetana Parakh**

Full Stack Developer / AI & ML Developer

GitHub: https://github.com/parakhchetana005-max

---

# 📄 License

This project was developed as a technical assignment for the **Roxiler Full Stack Developer Trainee** recruitment process.
