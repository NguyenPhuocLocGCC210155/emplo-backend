// controllers/leaveController.js
const { LeaveRequest, Employee } = require("../models");

exports.createLeaveRequest = async (req, res) => {
  const { date } = req.body;
  const employee_id = req.user.id;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    // 1. Lấy thông tin employee
    const employee = await Employee.findByPk(employee_id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2. Kiểm tra còn day_off không
    if (employee.day_off <= 0) {
      return res
        .status(400)
        .json({ message: "You have no remaining days off" });
    }

    // 3. Trừ 1 ngày nghỉ
    employee.day_off -= 1;
    await employee.save();

    // 4. Tạo đơn nghỉ phép
    const newLeave = await LeaveRequest.create({
      employee_id,
      date,
      day_off: 1,
      status: "pending",
    });

    res.status(201).json({
      message: "Leave request created",
      leave: newLeave,
      remaining_day_off: employee.day_off,
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

// Lấy danh sách đơn của chính employee
exports.getMyLeaveRequests = async (req, res) => {
  const employee_id = req.user.id;
  try {
    const leaves = await LeaveRequest.findAll({
      where: { employee_id },
      order: [["date", "DESC"]],
    });
    res.json(leaves);
  } catch (error) {
    console.error("Error fetching my leave requests:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    // Lấy tất cả leave requests kèm thông tin employee
    const leaves = await LeaveRequest.findAll({
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "email", "role","hire_date"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(leaves);
  } catch (error) {
    console.error("Error in getAllLeaveRequests:", error);
    res.status(500).json({
      message: "Error fetching leave requests",
      error: error.message || error,
    });
  }
};

exports.approveLeaveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) return res.status(404).json({ message: "Request not found" });
    if (leave.status !== "pending")
      return res
        .status(400)
        .json({ message: "Cannot approve non-pending request" });

    // Deduct 1 day from employee balance
    const employee = await Employee.findByPk(leave.employee_id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    if (employee.dayOffBalance <= 0)
      return res.status(400).json({ message: "No remaining day-off balance" });

    employee.dayOffBalance -= 1;
    await employee.save();

    leave.status = "approved";
    await leave.save();

    res.json({ message: "Leave approved", leave });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};

// 3. Reject leave request
exports.rejectLeaveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) return res.status(404).json({ message: "Request not found" });
    if (leave.status !== "pending")
      return res
        .status(400)
        .json({ message: "Cannot reject non-pending request" });

    leave.status = "rejected";
    await leave.save();

    res.json({ message: "Leave rejected", leave });
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};
