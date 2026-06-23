const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"),
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "PostgreSQL Connected Successfully"
    );
  } catch (error) {
    console.error(
      "Database Connection Failed"
    );
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};