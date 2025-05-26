// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employerRoutes = require('./routes/employerRoutes');
app.use('/api/auth', authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/employer", employerRoutes);

module.exports = app;

