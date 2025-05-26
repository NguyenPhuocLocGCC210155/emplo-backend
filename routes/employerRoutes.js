// routes/employee.route.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const {updateEmployeeById,deleteEmployeeById} = require("../controllers/employeeController");
const { getAllEmployeesPre,getEmployeeById } = require("../controllers/employerController");
const { getAllLeaveRequests,approveLeaveRequest,rejectLeaveRequest } = require("../controllers/leaveController");

// Middleware chung để chỉ cho phép employer
const authorizeEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

router.get("/", authenticateToken, (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  return getAllEmployeesPre(req, res);
});

router.get("/:id/employee",
  authenticateToken,
  authorizeEmployer,
  getEmployeeById
);

router.get("/leaves", authenticateToken, (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  return getAllLeaveRequests(req, res);
});

// PUT  /api/employer/leaves/:id/approve  → approve request
router.put(
  "/leaves/:id/approve",
  authenticateToken,
  authorizeEmployer,
  approveLeaveRequest
);

// PUT  /api/employer/leaves/:id/reject   → reject request
router.put(
  "/leaves/:id/reject",
  authenticateToken,
  authorizeEmployer,
  rejectLeaveRequest
);

router.put('/:id/update', authenticateToken, authorizeEmployer, updateEmployeeById);
router.delete("/:id/delete", authenticateToken ,authorizeEmployer, deleteEmployeeById );

module.exports = router;
