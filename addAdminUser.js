const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Models/userModal");
require("dotenv").config();

// MongoDB Connection String
const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/cosmeticsite";

async function addAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "suryasekar626@gmail.com";
    const adminPassword = "Surya@123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      
      // Update to admin role if not already admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("User role updated to admin");
      }
      
      mongoose.connection.close();
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const adminUser = new User({
      firstname: "Surya",
      lastname: "Sekar",
      email: adminEmail,
      phone: "1234567890",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password: Surya@123");
    console.log("Role: admin");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding admin user:", error.message);
    mongoose.connection.close();
  }
}

addAdminUser();
