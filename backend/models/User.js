const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      // Only required for email/password accounts
      required: [
        function () {
          return this.authProvider === "local";
        },
        "Password is required",
      ],
      minlength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls; unique when present
    },
    avatar: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
      trim: true,
      maxlength: 240,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 40,
    },
    gender: {
      type: String,
      default: "",
      trim: true,
      maxlength: 40,
    },
    country: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

// Hash password before save (skip if no password / Google user)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare plain password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);