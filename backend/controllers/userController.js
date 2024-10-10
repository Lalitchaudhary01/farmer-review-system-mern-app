import Farmer from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      password,
      confirmPassword,
      phone,
      bio,
      photo,
    } = req.body;

    // Check if all required fields are provided
    if (
      !fullName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !phone ||
      !bio ||
      !photo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if a user with the same username or email already exists
    const existingUser = await Farmer.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.username === username
            ? "Username already exists, try a different one"
            : "Email already exists, try a different one",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the additional fields: photo and name
    const newUser = await Farmer.create({
      fullName,
      email,
      username,
      password: hashedPassword,
      phone,
      bio,
      photo,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        bio: newUser.bio,
        photo: newUser.photo,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debugging logs
    console.log("Email:", email);
    console.log("Password:", password);

    // Check if both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await Farmer.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Debugging: Check if password is being retrieved correctly
    console.log("Stored user password:", user.password);

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // Debugging: Check if the password comparison is working
    console.log("Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Check if JWT secret key is set
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ message: "JWT Secret Key is missing" });
    }

    // Debugging: Check token data before signing the token
    const tokenData = { userId: user._id };
    console.log("Token data:", tokenData);

    // Sign the token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Login successful",
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        },
      });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
