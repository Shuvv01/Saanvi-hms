const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const publicUserAttributes = [
  "id",
  "fullname",
  "email",
  "phone",
  "role",
  "createdAt",
  "updatedAt",
];

const getUsersByRole = (role) =>
  User.findAll({
    where: { role },
    attributes: publicUserAttributes,
    order: [["createdAt", "DESC"]],
  });

exports.getDashboardSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      rejectedAppointments,
      recentAppointments,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: "doctor" } }),
      User.count({ where: { role: "patient" } }),
      Appointment.count(),
      Appointment.count({ where: { status: "Pending" } }),
      Appointment.count({ where: { status: "Approved" } }),
      Appointment.count({ where: { status: "Rejected" } }),
      Appointment.findAll({
        limit: 5,
        order: [["appointmentDate", "DESC"]],
      }),
    ]);

    res.json({
      totals: {
        users: totalUsers,
        doctors: totalDoctors,
        patients: totalPatients,
        appointments: totalAppointments,
      },
      appointmentStatus: [
        { name: "Pending", value: pendingAppointments },
        { name: "Approved", value: approvedAppointments },
        { name: "Rejected", value: rejectedAppointments },
      ],
      roleDistribution: [
        { name: "Doctors", value: totalDoctors },
        { name: "Patients", value: totalPatients },
        {
          name: "Admins",
          value: Math.max(totalUsers - totalDoctors - totalPatients, 0),
        },
      ],
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: publicUserAttributes,
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    res.json(await getUsersByRole("doctor"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    res.json(await getUsersByRole("patient"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;

    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({
        message: "Full name, email, phone, and password are required.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
    });

    const { password: _password, ...safeDoctor } = doctor.toJSON();
    res.status(201).json(safeDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: {
        id: req.params.id,
        role: "doctor",
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const { fullname, email, phone, password } = req.body;

    if (email && email !== doctor.email) {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    const updates = { fullname, email, phone };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await doctor.update(updates);

    const { password: _password, ...safeDoctor } = doctor.toJSON();
    res.json(safeDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: {
        id: req.params.id,
        role: "doctor",
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    await Appointment.destroy({ where: { doctorId: doctor.id } });
    await doctor.destroy();

    res.json({ message: "Doctor deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin users cannot be deleted." });
    }

    if (user.role === "doctor") {
      await Appointment.destroy({ where: { doctorId: user.id } });
    }

    if (user.role === "patient") {
      await Appointment.destroy({ where: { patientEmail: user.email } });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;
    const where = {};

    if (status !== "all") {
      where.status = status;
    }

    if (search.trim()) {
      const query = search.trim();
      const searchConditions = [
        { patientName: { [Op.iLike]: `%${search.trim()}%` } },
        { patientEmail: { [Op.iLike]: `%${search.trim()}%` } },
        { doctorName: { [Op.iLike]: `%${search.trim()}%` } },
      ];

      if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
        searchConditions.push({ appointmentDate: query });
      }

      where[Op.or] = searchConditions;
    }

    const appointments = await Appointment.findAll({
      where,
      order: [["appointmentDate", "DESC"]],
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status = req.body.status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
