const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_SERVER,
//     dialect: "mssql",
//     dialectOptions: {
//       options: {
//         encrypt: true,
//         trustServerCertificate: true,
//       },
//     },
//     logging: false, // tắt log query
//   }
// );

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mysql", // Đổi từ mssql sang mysql
    logging: false,   // Tắt log query
  }
);

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log("✅ Sequelize connected to SQL Server"))
  .catch((err) => console.error("❌ Sequelize connection error:", err));

// Import models
const Employee = require("./employee")(sequelize, DataTypes);
const LeaveRequest = require("./leaveRequest")(sequelize, DataTypes);

// Thiết lập quan hệ
Employee.hasMany(LeaveRequest, {
  foreignKey: "employee_id",
  as: "leaveRequests",
});
LeaveRequest.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

module.exports = {
  sequelize,
  Sequelize,
  Employee,
  LeaveRequest,
};
