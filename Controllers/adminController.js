const Admin = require("../Models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here-change-in-production";

// CREATE Admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name: name || "Admin",
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      message: "Admin Created Successfully",
      data: {
        _id: savedAdmin._id,
        email: savedAdmin.email,
        name: savedAdmin.name,
        role: savedAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Creating Admin",
      error: error.message,
    });
  }
};

// GET All Admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({
      message: "Admins fetched successfully",
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Fetching Admins",
      error: error.message,
    });
  }
};

// DELETE Admin
const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting Admin",
      error: error.message,
    });
  }
};

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check in Admin collection
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      // Fallback to hardcoded admin
      if (email === 'admin@blushandbloom.com' && password === 'Admin@123') {
        const token = jwt.sign(
          { userId: 'admin123', email: email, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Admin Login Successful',
          token: token,
          user: { _id: 'admin123', firstname: 'Admin', email: email, role: 'admin' },
        });
      }
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Admin Login Successful',
      token: token,
      user: {
        _id: admin._id,
        firstname: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  deleteAdmin,
  adminLogin,
};
