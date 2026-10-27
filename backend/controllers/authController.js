const User = require("../models/User");
const Habit = require("../models/Habits");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (Email/Password)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide name, email, and password",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
    });

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        about: user.about || "",
        phone: user.phone || "",
        gender: user.gender || "",
        country: user.country || "",
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Guard: If account was created with Google and has no password
    if (user && user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        status: "error",
        message: "This account was created using Google.",
      });
    }

    // Verify password using model method
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          about: user.about || "",
          phone: user.phone || "",
          gender: user.gender || "",
          country: user.country || "",
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Google OAuth Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({
        status: "error",
        message: "Google credential token is required",
      });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Find user by email or googleId
    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID and update avatar if not set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      await user.save();
    } else {
      // Create new Google account
      user = await User.create({
        name,
        email,
        googleId,
        avatar: avatar || "",
        authProvider: "google",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        about: user.about || "",
        phone: user.phone || "",
        gender: user.gender || "",
        country: user.country || "",
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Google authentication failed: " + error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const { name, email, avatar, about, phone, gender, country } = req.body || {};

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (about !== undefined) user.about = about;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (country !== undefined) user.country = country;

    // Only allow email updates if it's a new email and NOT a Google account
    if (email && email !== user.email) {
      if (user.authProvider === "google") {
        return res.status(400).json({ 
          status: "error", 
          message: "Cannot change the email of a Google-linked account." 
        });
      }

      // Ensure new email isn't already taken by someone else
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ 
          status: "error", 
          message: "This email is already in use." 
        });
      }
      
      user.email = email;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || "",
        about: updatedUser.about || "",
        phone: updatedUser.phone || "",
        gender: updatedUser.gender || "",
        country: updatedUser.country || "",
        authProvider: updatedUser.authProvider,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id), // Send fresh token
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Google accounts do not have passwords in our system
    if (user.authProvider === "google") {
      return res.status(400).json({
        status: "error",
        message: "You log in via Google. Password changes must be handled through your Google account.",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both current and new passwords.",
      });
    }

    // Check current password using the method in your User model
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid current password.",
      });
    }

    // Update password (the pre-save middleware in your User model will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Delete all habits for current user while keeping the account
// @route   DELETE /api/auth/data
// @access  Private
const deleteHabitData = async (req, res) => {
  try {
    const result = await Habit.deleteMany({ user: req.user._id });
    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} habit${result.deletedCount === 1 ? "" : "s"} deleted. Your account is unchanged.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Permanently delete account and its habits
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    await Habit.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({
      status: "success",
      message: "Your account and associated habit data have been deleted.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
  updatePassword,
  deleteHabitData,
  deleteAccount,
};