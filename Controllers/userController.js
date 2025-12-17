const User = require("../Models/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT Secret Key (you should move this to .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here-change-in-production";

// POST → Signup
const signupUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Input validation
    if (!firstname || !lastname || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully",
      data: {
        _id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Registering User",
      error: error.message,
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Password match using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Successful",
      token: token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error: error.message });
  }
};


// GET → All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Fetching Users",
      error: error.message,
    });
  }
};

// PUT → Update User by ID
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      if (updateData.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    // Prevent role update unless authorized
    if (updateData.role && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update roles" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating User",
      error: error.message,
    });
  }
};

// DELETE → Delete User by ID
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting User",
      error: error.message,
    });
  }
};

module.exports = {
  signupUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser
};
