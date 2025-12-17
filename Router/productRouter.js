const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

// Public Routes
router.get("/", getProducts); // Get all products with filters
router.get("/:id", getProductById); // Get single product

// Protected Admin Routes
router.post("/create", verifyToken, isAdmin, createProduct); // Admin only
router.put("/update/:id", verifyToken, isAdmin, updateProduct); // Admin only
router.delete("/delete/:id", verifyToken, isAdmin, deleteProduct); // Admin only

module.exports = router;
