const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");


dotenv.config();

const app = express();

const { connectDB, sequelize } = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes =
  require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Saanvi HMS Backend Running");
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/appointments",
  appointmentRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
const PORT = process.env.PORT || 5000;

const seedDefaultUsers = async () => {
  const defaultPassword = "test123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const defaultUsers = [
    {
      fullname: "Admin User",
      email: "admin@test.com",
      phone: "9000000000",
      password: hashedPassword,
      role: "admin",
    },
    {
      fullname: "Doctor User",
      email: "doctor@test.com",
      phone: "9111111111",
      password: hashedPassword,
      role: "doctor",
    },
    {
      fullname: "Patient User",
      email: "patient@test.com",
      phone: "9222222222",
      password: hashedPassword,
      role: "patient",
    },
  ];

  for (const userData of defaultUsers) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await User.create(userData);
      console.log(`Created default user: ${userData.email}`);
    }
  }
};

sequelize
  .sync()
  .then(async () => {
    await seedDefaultUsers();
    app.listen(PORT, () => {
      console.log(
        `Server Running On Port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });