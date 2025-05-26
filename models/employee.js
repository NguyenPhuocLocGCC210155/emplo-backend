const { INTEGER, INET } = require("sequelize");

// models/employee.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["employee", "employer"]],
        },
      },
      hire_date: DataTypes.DATEONLY,
      day_off: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wage: DataTypes.DECIMAL(10, 2),
    },
    {
      tableName: "Users",
      timestamps: false,
    }
  );
};
