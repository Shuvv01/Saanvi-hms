import { Routes, Route }
  from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import DoctorDashboard
  from "../pages/DoctorDashboard";

import PatientDashboard
  from "../pages/PatientDashboard";

import NurseDashboard
  from "../pages/NurseDashboard";

import ReceptionistDashboard
  from "../pages/ReceptionistDashboard";

import ProtectedRoute
  from "../components/ProtectedRoute";

import AdminDashboard
  from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute
            allowedRole="doctor"
          >
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute
            allowedRole="patient"
          >
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse-dashboard"
        element={
          <ProtectedRoute
            allowedRole="nurse"
          >
            <NurseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist-dashboard"
        element={
          <ProtectedRoute
            allowedRole="receptionist"
          >
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute
            allowedRole="admin"
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;