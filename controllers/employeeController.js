const { Employee } = require("../models");

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { role: "employee" },
      attributes: ["id", "name", "email", "role"],
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message || error,
    });
  }
};

exports.updateEmployeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { wage, day_off } = req.body; // các trường muốn update

    // Tìm employee theo id
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) {
      return res
        .status(404)
        .json({ message: `Employee with id ${id} not found` });
    }

    // Cập nhật những trường được gửi lên (nếu có)
    if (wage !== undefined) employee.wage = wage;
    if (day_off !== undefined) employee.day_off = day_off;

    await employee.save();

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({
      message: "Error updating employee",
      error: error.message || error,
    });
  }
};

exports.deleteEmployeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const deletedCount = await Employee.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: `Employee with id ${id} not found` });
    }

    res.json({ message: `Employee with id ${id} deleted successfully` });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Error deleting employee",
      error: error.message || error,
    });
  }
};
