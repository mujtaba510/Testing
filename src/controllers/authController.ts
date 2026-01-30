import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import emailService from "../config/email";

// Generate 4-digit OTP
const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate JWT Token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const expiresIn = (process.env.JWT_EXPIRY ||
    "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ userId }, jwtSecret, { expiresIn });
};

// POST /api/auth/signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Hash OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Create new user
    const user = new User({
      email,
      password,
      otp: hashedOTP,
      otpExpiry,
      isVerified: false,
    });

    await user.save();

    // Send OTP via email
    try {
      await emailService.sendOTP(email, otp);
    } catch (emailError) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      console.error("Email sending failed:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      data: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if already verified
    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
      return;
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
      return;
    }

    // Check OTP expiry
    if (new Date() > user.otpExpiry) {
      res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    // Activate account
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if account is verified
    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: "Please verify your account first",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Set cookie
    const cookieExpiry = parseInt(process.env.COOKIE_EXPIRY || "1", 10);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieExpiry * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
