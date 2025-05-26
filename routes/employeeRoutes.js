// routes/employee.route.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const { getAllEmployees } = require("../controllers/employeeController");
const { createLeaveRequest, getMyLeaveRequests } = require("../controllers/leaveController");

// Middleware chỉ cho phép employee
const authorizeEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Forbidden: Employees only" });
  }
  next();
};

router.get(
  "/",
  authenticateToken,
  authorizeEmployee,
  getAllEmployees
);

// Employee tạo đơn nghỉ
router.post(
  "/leaves",
  authenticateToken,
  (req, res, next) => {
    // Phân quyền chỉ employee được tạo
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  createLeaveRequest
);

router.get(
  "/leaves",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getMyLeaveRequests
);

module.exports = router;
