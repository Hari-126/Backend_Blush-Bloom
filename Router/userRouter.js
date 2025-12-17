const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

const {
  signupUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
} = require("../Controllers/userController");

// Public Routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Protected Routes (require authentication)
router.get("/all", verifyToken, isAdmin, getUsers); // Admin only
router.put("/update/:id", verifyToken, updateUser); // Authenticated users
router.delete("/delete/:id", verifyToken, isAdmin, deleteUser); // Admin only

module.exports = router;
