const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "Personal",
      trim: true,
    },
    frequency: {
      type: String,
      default: "Every day",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Not Started", "Paused"],
      default: "Not Started",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    goal: {
      type: String,
      default: "",
      trim: true,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
    reminderTime: {
      type: String,
      default: "",
      trim: true,
    },
    iconName: {
      type: String,
      default: "Goal",
      trim: true,
    },
    color: {
      type: String,
      default: "green",
      trim: true,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    best: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Frontend contract: 0–100 percentage
    thisWeek: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Mon=0 … Sun=6
    weekDone: {
      type: [Boolean],
      default: () => Array(7).fill(false),
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 7,
        message: "weekDone must be an array of 7 booleans",
      },
    },
    // Monthly history: ["YYYY-MM-DD", ...]
    completedDates: {
      type: [String],
      default: [],
    },
    tag: {
      type: String,
      default: "New habit",
      trim: true,
    },
    tagColor: {
      type: String,
      default: "blue",
      trim: true,
    },
  },
  { timestamps: true }
);

// Mongoose v7/v8: sync pre-save, no `next`
habitSchema.pre("save", function () {
  if (this.title && !this.name) this.name = this.title;
  if (this.name && !this.title) this.title = this.name;
  if (this.title) this.name = this.title;
});

module.exports = mongoose.model("Habit", habitSchema);