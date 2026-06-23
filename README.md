# 🏥 Saanvi HMS - Hospital Management System

A full-stack hospital management system with role-based access control. Manage patients, doctors, appointments, nurses, and receptionists all in one integrated platform.

## ✨ Features

- **5 User Roles**: Admin, Doctor, Patient, Nurse, and Receptionist
- **Role-Based Dashboards**: Each role has a dedicated dashboard with specific features
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Appointment Management**: Schedule and manage appointments
- **Patient Management**: Track patient information and medical records
- **Responsive Design**: Mobile-friendly UI with Bootstrap 5
- **Real-time Data**: SQLite database with Sequelize ORM

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### 1. Clone & Setup Backend

```bash
cd saanvi-hms
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
JWT_SECRET=saanvi_hms_secret_key_2024
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on: **http://localhost:5000**

### 2. Setup Frontend (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5174**

## 📋 Test Results

### ✅ Server Status
- ✓ Backend Server: Running on http://localhost:5000
- ✓ Frontend Server: Running on http://localhost:5174
- ✓ Database: SQLite (backend/database.sqlite) - 20 KB

### ✅ Authentication Testing
- ✓ Receptionist Registration: PASSED
- ✓ Receptionist Login: PASSED
- ✓ JWT Token Generation: PASSED
- ✓ Nurse Registration: PASSED
- ✓ Nurse Login: PASSED
- ✓ JWT Token Valid: PASSED

### ✅ All 5 Roles Supported
```
✓ Admin              - System administration & analytics
✓ Doctor            - Manage appointments & patients
✓ Patient           - View appointments & medical records
✓ Nurse      (NEW)  - Patient care, medications, vital signs
✓ Receptionist (NEW) - Appointments, billing, registrations
```

### ✅ Routes Configuration
```
/                              → Login Page
/register                      → Register Page (all 5 roles)
/admin-dashboard              → Admin Dashboard (Protected)
/doctor-dashboard             → Doctor Dashboard (Protected)
/patient-dashboard            → Patient Dashboard (Protected)
/nurse-dashboard              → Nurse Dashboard (Protected) - NEW
/receptionist-dashboard       → Receptionist Dashboard (Protected) - NEW
```

### ✅ API Endpoints Tested
```
POST /api/auth/register       → Registers users with all roles
POST /api/auth/login          → Returns JWT token + user data
GET  /api/auth/doctors        → Get all doctors (protected)
GET  /api/appointments        → Get appointments (protected)
POST /api/appointments        → Create appointment (protected)
```

### ✅ Database Schema
- User Table with ENUM roles:
  - admin
  - doctor
  - patient
  - nurse (NEW)
  - receptionist (NEW)

### ✅ File Structure
```
✓ backend/config/roles.js
✓ backend/config/db.js (SQLite)
✓ backend/models/User.js (with all 5 roles)
✓ frontend/src/pages/NurseDashboard.jsx (NEW)
✓ frontend/src/pages/NurseDashboard.css (NEW)
✓ frontend/src/pages/ReceptionistDashboard.jsx (NEW)
✓ frontend/src/pages/ReceptionistDashboard.css (NEW)
✓ frontend/src/routes/AppRoutes.jsx (UPDATED)
✓ frontend/src/pages/Login.jsx (UPDATED)
✓ frontend/src/pages/Register.jsx (UPDATED)
```

## 🧪 How to Test

### Test Nurse Registration & Login
1. Go to [http://localhost:5174/register](http://localhost:5174/register)
2. Click **👩‍⚕️ Nurse** button
3. Fill in the form:
   - Full Name: Nurse Sarah
   - Email: nurse@example.com
   - Phone: 9876543210
   - Password: test123456
4. Click "Register as Nurse"
5. Login with same credentials
6. You'll be redirected to **Nurse Dashboard**

### Test Receptionist Registration & Login
1. Go to [http://localhost:5174/register](http://localhost:5174/register)
2. Click **👩‍💼 Reception** button
3. Fill in the form:
   - Full Name: Reception Staff
   - Email: reception@example.com
   - Phone: 9876543210
   - Password: test123456
4. Click "Register as Receptionist"
5. Login with same credentials
6. You'll be redirected to **Receptionist Dashboard**

### Test Other Roles
Similarly, register as **Admin**, **Doctor**, or **Patient** using the respective role buttons on the register page.

## 📊 Test Accounts Created
```
Receptionist:
  Email: reception001@test.com
  Role: receptionist
  
Nurse:
  Email: nurse001@test.com
  Role: nurse
```

## 🏗️ Project Structure

```
saanvi-hms/
├── backend/
│   ├── config/
│   │   ├── db.js                 (SQLite configuration)
│   │   └── roles.js              (Role definitions)
│   ├── controllers/
│   │   ├── authController.js     (Auth logic)
│   │   ├── appointmentController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     (JWT verification)
│   │   └── roleMiddleware.js     (Role-based access)
│   ├── models/
│   │   ├── User.js               (with all 5 roles)
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   └── Patient.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── adminRoutes.js
│   ├── .env                      (Environment variables)
│   ├── server.js                 (Server entry point)
│   ├── package.json
│   └── database.sqlite           (Auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── NurseDashboard.jsx           (NEW)
│   │   │   ├── ReceptionistDashboard.jsx    (NEW)
│   │   │   └── *.css
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx               (UPDATED - all routes)
│   │   ├── api/
│   │   │   └── authApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
├── README.md                     (This file)
└── ROLES_IMPLEMENTATION.md       (Implementation details)
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Role-Based Access Control**: Protected routes by role
- **CORS Enabled**: For frontend-backend communication
- **Environment Variables**: Sensitive data in .env

## 📦 Dependencies

### Backend
- **express** - Web framework
- **sequelize** - ORM
- **sqlite3** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **bootstrap** - CSS framework
- **react-icons** - Icons
- **react-toastify** - Notifications
- **recharts** - Charts

## 🛠️ Available Scripts

### Backend
```bash
npm run dev       # Start with auto-reload (nodemon)
npm start         # Start production server
npm audit         # Check vulnerabilities
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## 🔧 Troubleshooting

### Port Already in Use
If port 5000 or 5174 is busy, update the PORT in backend `.env` or frontend will auto-use next available port.

### Database Reset
To reset the database and start fresh:
```bash
# Delete the database file
rm backend/database.sqlite

# Restart the backend server
npm run dev
```

### CORS Errors
Ensure both servers are running and the API URL in `frontend/src/api/authApi.js` matches your backend URL.

### Dependencies Not Installing
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Live Access

| Link | Purpose |
|------|---------|
| [http://localhost:5174](http://localhost:5174) | Frontend Application |
| [http://localhost:5174/register](http://localhost:5174/register) | Registration Page |
| [http://localhost:5000](http://localhost:5000) | Backend API |

## 📈 Recent Updates

- ✅ Removed duplicate folder structure
- ✅ Added Nurse role with dedicated dashboard
- ✅ Added Receptionist role with dedicated dashboard
- ✅ Updated User model to support all 5 roles
- ✅ Created roles.js configuration file
- ✅ Updated AppRoutes for all role-based dashboards
- ✅ Updated Login component to handle all roles
- ✅ Updated Register component with all role options
- ✅ Reset SQLite database with new schema
- ✅ Tested all authentication endpoints
- ✅ Verified all roles and dashboards

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/register
{
  "fullname": "User Name",
  "email": "user@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "patient|doctor|nurse|receptionist|admin"
}

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
Returns: { token, user: { id, fullname, email, role } }
```

### Protected Endpoints (Require JWT Token)
```
GET /api/auth/doctors              (Any authenticated user)
GET /api/appointments              (Patient, Doctor, Nurse, Receptionist)
POST /api/appointments             (Patient, Doctor, Receptionist)
PUT /api/appointments/:id          (Doctor, Receptionist)
DELETE /api/appointments/:id       (Doctor, Admin)
GET /api/admin/users              (Admin only)
GET /api/admin/stats              (Admin only)
```

## 🤝 Contributing

For any issues or improvements, please update the relevant files and test thoroughly before pushing.

## 📄 License

ISC License - See package.json files for details.

## 👥 Team

Developed as part of the HMS internship program.

---

**Status**: ✅ **FULLY FUNCTIONAL** - All 5 roles working with dedicated dashboards and authentication.

**Last Updated**: 2026-06-23

**Repository**: [Shuvv01/Saanvi-hms](https://github.com/Shuvv01/Saanvi-hms)
