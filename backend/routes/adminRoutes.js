const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getDashboardSummary,
  getUsers,
  getDoctors,
  getPatients,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createPatient,
  updatePatient,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  deleteUser,
  getAppointments,
  updateAppointmentStatus,
} = require("../controllers/adminController");

router.use(verifyToken);
router.use(authorizeRole("admin"));

router.get("/summary", getDashboardSummary);

router.get("/users", getUsers);

router.delete("/users/:id", deleteUser);

router.get("/doctors", getDoctors);

router.post("/doctors", createDoctor);

router.put("/doctors/:id", updateDoctor);

router.delete("/doctors/:id", deleteDoctor);

router.get("/patients", getPatients);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);

router.get("/appointments", getAppointments);

router.put("/appointments/:id/status", updateAppointmentStatus);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;
