const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
  updatePassword,
  deleteHabitData,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Protected routes
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.delete("/data", protect, deleteHabitData);
router.delete("/account", protect, deleteAccount);

module.exports = router;