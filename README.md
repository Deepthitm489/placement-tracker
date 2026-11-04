# 🎓 Placement Tracker – Student Placement Management System

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application designed for university students to manage recruitment drives, track job application statuses, monitor upcoming interview countdowns, and analyze placement conversion metrics in a modern SaaS interface.

---

## 🌟 Key Features

1. **Secure Student Authentication (JWT & bcrypt)**
   - Complete signup workflow (Full Name, College Email, Password, College, Branch, Graduation Year).
   - Password encryption using industry-standard `bcryptjs` (salt rounds: 10).
   - Stateless JWT tokens stored securely with automatic session persistence across page refreshes.
   - Strict data isolation: students only ever access their own placement records.

2. **Application Lifecycle Management**
   - Full CRUD: Add, edit, delete, and view company applications.
   - Track key fields: Company Name, Job Role, Job Description, Date Applied, Portal URL, Location, Salary/Package, Status, Interview Date & Time, and Interview Prep Notes.
   - Allows multiple applications to the same company for distinct roles.
   - Quick inline status switcher.
   - Interactive deletion confirmation modal.
   - Clean printable application dossier modal (`window.print()` ready).
   - Instant export to CSV spreadsheet.

3. **Visually Distinct Status Badges**
   - 🔵 **Applied**: Blue badge with send indicator.
   - 🟡 **Online Test**: Amber badge with timer icon.
   - 🟣 **Interview**: Purple badge with video call icon.
   - 🟢 **Offer**: Emerald badge with award medal.
   - 🔴 **Rejected**: Rose badge with close indicator.

4. **Dynamic Placement Dashboard & Recharts**
   - 6 Quick KPI cards: Total Applications, Applied, Online Tests, Interviews, Offers Received, Rejected.
   - Placement success metrics: Offer Conversion Rate (%), Interview Call Rate (%), Active Pipeline count.
   - **Interactive Status Distribution Donut Chart** (Recharts Pie).
   - **Monthly Application Velocity Bar Chart** (Recharts Bar).
   - Recent applications table with direct edit shortcuts.
   - All statistics calculated dynamically on MongoDB.

5. **Upcoming Interview Radar (7-Day Alerts)**
   - Dedicated countdown tracker for upcoming technical and HR rounds.
   - Filters out past interviews automatically.
   - Visual urgency tags: `🔥 Today!`, `⚡ Tomorrow`, or `In X days`.
   - Alert notifications badge on the top navbar with quick dropdown preview.

6. **Search, Advanced Filters & Sorting**
   - Real-time search by company name, job role, or location.
   - Filter by recruitment status (`All`, `Applied`, `Online Test`, `Interview`, `Offer`, `Rejected`).
   - Filter by date range (start date & end date).
   - Sort by newest applied, oldest applied, company A-Z, company Z-A, or interview date.
   - Table view and Responsive Grid card view toggle.
   - One-click "Reset Filters" action.

7. **Demo Mode (Isolated Sample Data)**
   - Optional demo loader button (`Load Sample Data`) to populate realistic graduate recruitment applications (Google, Microsoft, Amazon, Adobe, Swiggy, TCS, etc.) for the logged-in student only. Never mixes with other users' records.

8. **Modern SaaS UI & Dark Mode**
   - Professional color palette: **Navy Blue** (`#0f172a`), **Clean White**, with **Subtle Purple/Indigo Accents** (`#6366f1` / `#7c3aed`).
   - Full Light / Dark mode toggle with `localStorage` preference memory.
   - Mobile-responsive sidebar drawer with backdrop overlay.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React icons |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `morgan` |
| **Database** | MongoDB Atlas / MongoDB Community Server |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`) |

---

## 📁 Clean Folder Structure

```
placement-tracker/
├── package.json               # Root scripts for running backend and frontend
├── .gitignore                 # Standard gitignore for node_modules, .env, dist
├── README.md                  # Complete documentation and deployment guide
│
├── backend/                   # Express.js REST API
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection & error recovery
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile, password change
│   │   ├── applicationController.js # CRUD, search, filter, CSV, seed demo
│   │   └── dashboardController.js   # Dynamic metrics, charts, interview radar
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & req.user attachment
│   │   └── errorMiddleware.js # 404 handler & global Mongoose error sanitizer
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt pre-save & indexing
│   │   └── Application.js     # Application schema with compound indexes
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth endpoints
│   │   ├── applicationRoutes.js # /api/applications endpoints
│   │   └── dashboardRoutes.js # /api/dashboard endpoints
│   ├── tests/
│   │   ├── api.test.js        # Unit tests for bcrypt, JWT, status, analytics
│   │   └── routes.test.js     # Controller validation & error handling tests
│   ├── utils/
│   │   └── generateToken.js   # JWT sign utility
│   ├── server.js              # Express app entrypoint, CORS, health check
│   ├── .env.example           # Backend environment template
│   └── package.json
│
└── frontend/                  # React + Vite + Tailwind CSS SPA
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── DeleteModal.jsx    # Application deletion confirmation modal
    │   │   ├── Navbar.jsx         # Top navbar, interview alert bell, theme toggle
    │   │   ├── PrintModal.jsx     # Printable application dossier sheet
    │   │   ├── ProtectedRoute.jsx # Client-side auth route guard
    │   │   ├── Sidebar.jsx        # Navigation links & mobile drawer
    │   │   └── StatusBadge.jsx    # Visually distinct recruitment stage badges
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Global login state, token, user profile
    │   │   └── ThemeContext.jsx   # Light / Dark theme context provider
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx # Master layout with sidebar & topbar
    │   ├── pages/
    │   │   ├── AnalyticsPage.jsx  # Conversion funnel & velocity charts
    │   │   ├── ApplicationForm.jsx # Add & Edit application form
    │   │   ├── ApplicationsList.jsx # Search, filter, sort, table & grid view
    │   │   ├── Dashboard.jsx      # Metrics overview, charts, upcoming alerts
    │   │   ├── InterviewsPage.jsx # 7-Day interview radar & countdowns
    │   │   ├── Login.jsx          # Student sign-in page
    │   │   ├── NotFound.jsx       # 404 page
    │   │   ├── ProfilePage.jsx    # Student profile & password settings
    │   │   └── Register.jsx       # Student signup with academic fields
    │   ├── services/
    │   │   └── api.js             # Axios client with JWT interceptor
    │   ├── App.jsx                # React Router tree
    │   ├── index.css              # Tailwind base, utilities & print styles
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── vercel.json                # Vercel SPA client-side routing rewrites
    ├── .env.example
    └── package.json
```

---

## 🗄️ Database Schema & Indexes

### `User` Collection
- `name` (String, required, max 100)
- `email` (String, required, unique, lowercase, trimmed)
- `password` (String, required, min 6, hashed with bcrypt, omitted from JSON output)
- `college` (String, required)
- `branch` (String, required)
- `graduationYear` (Number, required)
- `createdAt` / `updatedAt` (Timestamps)
- **Index**: Unique index on `email: 1`.

### `Application` Collection
- `userId` (ObjectId referencing `User`, required, indexed)
- `companyName` (String, required, max 120)
- `jobRole` (String, required, max 120)
- `jobDescription` (String)
- `dateApplied` (Date, default `Date.now`)
- `applicationLink` (String)
- `location` (String, default `'Not specified'`)
- `salary` (String, e.g. `'12 LPA'`)
- `status` (Enum: `['Applied', 'Online Test', 'Interview', 'Offer', 'Rejected']`)
- `interviewDate` (Date, optional)
- `interviewTime` (String, optional)
- `notes` (String)
- `createdAt` / `updatedAt` (Timestamps)
- **Compound Performance Indexes**:
  - `{ userId: 1, status: 1 }`
  - `{ userId: 1, dateApplied: -1 }`
  - `{ userId: 1, interviewDate: 1 }`
  - `{ userId: 1, companyName: 1 }`

---

## 🔌 Backend REST API Reference

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `POST` | `/api/auth/login` | Public | Authenticate student and issue JWT |
| `GET` | `/api/auth/me` | Private | Fetch currently logged-in student profile |
| `PUT` | `/api/auth/profile` | Private | Update student profile or change password |

### Applications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/applications` | Private | Fetch applications with search, status filter, date range & sort |
| `POST` | `/api/applications` | Private | Create new company application |
| `GET` | `/api/applications/:id` | Private | Fetch single application details (ownership verified) |
| `PUT` | `/api/applications/:id` | Private | Update existing application record (ownership verified) |
| `DELETE` | `/api/applications/:id` | Private | Permanently delete application (ownership verified) |
| `POST` | `/api/applications/seed-demo` | Private | Seed sample applications for current student |

### Dashboard & Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Private | Dynamic metrics, status distribution, monthly counts |
| `GET` | `/api/dashboard/recent` | Private | Fetch 5 most recent applications |
| `GET` | `/api/dashboard/interviews` | Private | Upcoming interviews with `daysRemaining` & 7-day urgency |

### System
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Service health, MongoDB readyState & uptime |

---

## 🚀 Running Locally in VS Code

### Step 1: Open the Project
Open VS Code in the project root:
```bash
cd placement-tracker
```

### Step 2: Configure Backend Environment Variables
1. Navigate to the `backend/` folder.
2. Create `.env` from `.env.example`:
```bash
cd backend
cp .env.example .env
```
3. Edit `backend/.env` with your settings:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/placement_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(If running local MongoDB, you can use `mongodb://127.0.0.1:27017/placement_tracker`)*.

### Step 3: Run Backend Server
In the `backend` folder:
```bash
npm run dev
```
The server will start on `http://localhost:5000`. You can test it by opening `http://localhost:5000/api/health` in your browser.

### Step 4: Run Frontend Development Server
Open a new terminal tab in VS Code:
```bash
cd frontend
npm run dev
```
The client will start on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

### Step 5: Run Automated Tests
In the `backend` folder:
```bash
npm test
```
All 11 unit and integration tests will execute against password security, token generation, status validation, and route guards.

---

## 🌐 Public Cloud Deployment Guide

### 1. Database: MongoDB Atlas (Free Tier / Production)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free cluster (M0) or select an existing cluster.
3. Under **Database Access**, create a user (e.g. `placement_admin`) with **Read and Write to Any Database** permissions.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render/cloud hosting platforms.
5. Click **Connect** > **Drivers** > **Node.js** and copy your connection string:
   ```
   mongodb+srv://placement_admin:<PASSWORD>@cluster0.abcde.mongodb.net/placement_tracker?retryWrites=true&w=majority
   ```

### 2. Backend Deployment: Render (or Railway)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI from Step 1>`
   - `JWT_SECRET`: `<Generate a random 32+ character string>`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `<Your Vercel Frontend URL, e.g. https://placement-tracker.vercel.app>`
7. Click **Deploy Web Service**.
8. Note down your backend URL (e.g. `https://placement-tracker-backend.onrender.com`).
9. Verify the deployment: visit `https://placement-tracker-backend.onrender.com/api/health` to confirm the database status is `connected`.

### 3. Frontend Deployment: Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project** and select your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://placement-tracker-backend.onrender.com/api`
5. Click **Deploy**.
6. Vercel will build the frontend assets. The included `frontend/vercel.json` ensures that all routes (`/dashboard`, `/applications`, `/interviews`) work without 404 errors on page refreshes.

---

## 💾 MongoDB Backup & Restore Guidance

### Creating a Database Backup (`mongodump`)
To back up all student applications and user records from MongoDB Atlas:
```bash
mongodump --uri="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/placement_tracker" --out="./backup_$(date +%Y%m%d)"
```

### Restoring from Backup (`mongorestore`)
To restore application records into a new or existing database:
```bash
mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/placement_tracker" --drop "./backup_20261104/placement_tracker"
```

### Exporting via GUI (MongoDB Compass)
1. Connect to your cluster in **MongoDB Compass**.
2. Select the `placement_tracker` database.
3. Open the `applications` collection and click **Collection** > **Export Collection** > **Export full collection as JSON or CSV**.

---

## 🛡️ Security Best Practices Implemented

- **Password Hashing**: Passwords are never stored as plain text. The application uses `bcryptjs` with salt rounds = 10.
- **Credential Separation**: Secrets (`JWT_SECRET`, `MONGODB_URI`) are strictly loaded via `dotenv` and never leaked in client bundles.
- **Ownership Verification**: All application queries and updates enforce `userId: req.user._id`.
- **CORS Configuration**: Restricts API calls to approved client domains.
- **Input Sanitization**: Rejects invalid statuses, negative years, and malformed emails.
