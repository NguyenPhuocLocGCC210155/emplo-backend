// models/leaveRequest.js
module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define(
    "LeaveRequest",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "approved", "rejected"]],
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "LeaveRequests",
      timestamps: false,
    }
  );

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
  };

  return LeaveRequest;
};
