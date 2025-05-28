const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "e4b3c5b6c9cde858d8598af8c7b9a0d2f60ff4e9e53a4ce60a6c59dd48bdbaf4";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // gắn user vào req
    next();
  });
};

module.exports = authenticateToken;
