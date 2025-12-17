const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

const {
  createAdmin,
  getAdmins,
  deleteAdmin,
  adminLogin,
} = require("../Controllers/adminController");

// Public Routes
router.post("/login", adminLogin);

// Protected Admin Routes
router.post("/create", verifyToken, isAdmin, createAdmin);
router.get("/all", verifyToken, isAdmin, getAdmins);
router.delete("/delete/:id", verifyToken, isAdmin, deleteAdmin);

module.exports = router;
