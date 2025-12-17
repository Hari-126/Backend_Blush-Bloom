const Product = require("../Models/productModel");

// CREATE Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, brand, rating, reviews, featured } = req.body;

    // Validation
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
      brand,
      rating: rating || 0,
      reviews: reviews || 0,
      featured: featured || false,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product Created Successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Creating Product",
      error: error.message,
    });
  }
};

// GET All Products
const getProducts = async (req, res) => {
  try {
    const { category, featured, minPrice, maxPrice } = req.query;
    let query = {};

    // Filter by category
    if (category) query.category = category;

    // Filter by featured
    if (featured) query.featured = featured === "true";

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Fetching Products",
      error: error.message,
    });
  }
};

// GET Single Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Fetching Product",
      error: error.message,
    });
  }
};

// UPDATE Product by ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Product",
      error: error.message,
    });
  }
};

// DELETE Product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product Deleted Successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting Product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
