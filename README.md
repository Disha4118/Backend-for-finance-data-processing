# 💰 Finance Data Processing and Access Control Backend

A RESTful backend API for a **Finance Dashboard System** built with **Node.js**, **Express.js**, and **MongoDB**. This system supports role-based access control, financial record management, and dashboard summary analytics.

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Runtime      | Node.js                 |
| Framework    | Express.js              |
| Database     | MongoDB (via Mongoose)  |
| Auth         | JWT (JSON Web Tokens)   |
| Validation   | express-validator       |
| Environment  | dotenv                  |

---

## 📁 Project Structure

```
finance-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema (name, email, role, status)
│   │   └── Transaction.js         # Financial record schema
│   ├── middlewares/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── roleGuard.js           # Role-based access control
│   ├── controllers/
│   │   ├── authController.js      # Login / register logic
│   │   ├── userController.js      # User management (admin only)
│   │   ├── transactionController.js  # CRUD for financial records
│   │   └── dashboardController.js # Summary and analytics
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── dashboardRoutes.js
│   └── app.js                     # Express app setup
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-backend.git
cd finance-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Start the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 👥 Roles and Permissions

| Permission               | Viewer | Analyst | Admin |
|--------------------------|--------|---------|-------|
| View dashboard summary   | ✅     | ✅      | ✅    |
| View financial records   | ✅     | ✅      | ✅    |
| Access insights/analytics| ❌     | ✅      | ✅    |
| Create records           | ❌     | ❌      | ✅    |
| Update records           | ❌     | ❌      | ✅    |
| Delete records           | ❌     | ❌      | ✅    |
| Manage users             | ❌     | ❌      | ✅    |

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint             | Description           | Access  |
|--------|----------------------|-----------------------|---------|
| POST   | `/api/auth/register` | Register a new user   | Public  |
| POST   | `/api/auth/login`    | Login and get JWT     | Public  |

### Users

| Method | Endpoint              | Description              | Access  |
|--------|-----------------------|--------------------------|---------|
| GET    | `/api/users`          | Get all users            | Admin   |
| GET    | `/api/users/:id`      | Get user by ID           | Admin   |
| PATCH  | `/api/users/:id/role` | Update user role         | Admin   |
| PATCH  | `/api/users/:id/status` | Activate/deactivate user | Admin |
| DELETE | `/api/users/:id`      | Delete a user            | Admin   |

### Transactions (Financial Records)

| Method | Endpoint                   | Description                     | Access          |
|--------|----------------------------|---------------------------------|-----------------|
| GET    | `/api/transactions`        | Get all records (with filters)  | Viewer+         |
| GET    | `/api/transactions/:id`    | Get record by ID                | Viewer+         |
| POST   | `/api/transactions`        | Create a new record             | Admin           |
| PUT    | `/api/transactions/:id`    | Update a record                 | Admin           |
| DELETE | `/api/transactions/:id`    | Delete a record                 | Admin           |

#### Query Filters (GET /api/transactions)

```
?type=income           # Filter by type: income | expense
?category=salary       # Filter by category
?startDate=2024-01-01  # Filter from date
?endDate=2024-03-31    # Filter to date
?page=1&limit=10       # Pagination
```

### Dashboard

| Method | Endpoint                        | Description                    | Access    |
|--------|---------------------------------|--------------------------------|-----------|
| GET    | `/api/dashboard/summary`        | Total income, expenses, balance | Viewer+  |
| GET    | `/api/dashboard/category-totals`| Totals grouped by category     | Analyst+  |
| GET    | `/api/dashboard/trends`         | Monthly income/expense trends  | Analyst+  |
| GET    | `/api/dashboard/recent`         | Recent 10 transactions         | Viewer+   |

---

## 📦 Data Models

### User

```json
{
  "name": "Disha Tiwari",
  "email": "disha@example.com",
  "password": "hashed_password",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-04-01T00:00:00Z"
}
```

**Role values:** `viewer` | `analyst` | `admin`

### Transaction

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2026-03-31",
  "notes": "March salary credit",
  "createdBy": "<user_id>",
  "createdAt": "2026-04-01T00:00:00Z"
}
```

**Type values:** `income` | `expense`

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on successful login and expire based on `JWT_EXPIRES_IN` in your `.env`.

---

## 🧪 Example Requests

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Disha Tiwari",
  "email": "disha@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

### Create Transaction (Admin only)

```bash
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 12000,
  "type": "expense",
  "category": "marketing",
  "date": "2026-03-28",
  "notes": "Q1 marketing campaign"
}
```

### Get Dashboard Summary

```bash
GET /api/dashboard/summary
Authorization: Bearer <token>
```

**Response:**

```json
{
  "totalIncome": 150000,
  "totalExpenses": 85000,
  "netBalance": 65000
}
```

---

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Unauthorized: insufficient permissions",
  "statusCode": 403
}
```

| Status Code | Meaning                        |
|-------------|--------------------------------|
| 200         | Success                        |
| 201         | Created                        |
| 400         | Bad Request / Validation Error |
| 401         | Unauthenticated                |
| 403         | Forbidden (wrong role)         |
| 404         | Resource Not Found             |
| 500         | Internal Server Error          |

---

## 📌 Assumptions Made

- The first registered user with `role: admin` manages the system. Role assignment is done by an admin.
- Passwords are hashed using `bcryptjs` before storing in MongoDB.
- Soft delete is not implemented in the core version; records are hard-deleted. (Can be added as an enhancement.)
- JWT is used for stateless authentication. Sessions are not maintained server-side.
- `createdBy` field on transactions stores the admin user's ID who created it.
- All monetary amounts are stored as numbers (no multi-currency support assumed).

---

## 🔮 Optional Enhancements (Planned / Can Be Added)

- [ ] Pagination on all list endpoints
- [ ] Full-text search on transactions (notes/category)
- [ ] Soft delete with `isDeleted` flag
- [ ] Rate limiting using `express-rate-limit`
- [ ] Unit and integration tests using Jest + Supertest
- [ ] Swagger/OpenAPI documentation

---

## 📄 License

This project is built for assessment purposes as part of the Zorvyn Backend Developer Internship assignment.
#
