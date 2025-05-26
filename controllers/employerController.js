const { Employee } = require("../models");

exports.getAllEmployeesPre = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { role: "employee" },
      attributes: ["id", "name", "email", "role" , "wage" , "hire_date" ]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message || error, });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const employee = await Employee.findAll({
      where: { id : id },
      attributes: ["id", "name", "email", "role", "wage", "hire_date", "day_off"] // thêm các field nếu cần
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employee",
      error: error.message || error,
    });
  }
};
