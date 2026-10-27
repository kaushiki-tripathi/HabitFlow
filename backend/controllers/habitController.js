const Habit = require("../models/Habits");
const { aggregateDashboardStats, buildMonthlyHistogram } = require("../utils/dsaHelpers");
const { calculateHabitStreaks, formatLocalDateKey } = require("../utils/streaks");

const getTodayDateString = () => formatLocalDateKey(new Date());

// GET /api/habits (User-scoped)
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/habits/stats (User-scoped DSA 1-Pass Aggregation)
const getHabitsStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const stats = aggregateDashboardStats(habits);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/habits/monthly (User-scoped DSA Monthly Histogram)
const getMonthlyStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;

    const monthlyData = buildMonthlyHistogram(habits, year, month);

    res.status(200).json({
      status: "success",
      data: monthlyData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// POST /api/habits (User-scoped)
const createHabit = async (req, res) => {
  try {
    const body = req.body || {};
    const title = (body.title || body.name || "").trim();

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "title is required",
      });
    }

    const notes = body.notes ?? "";
    const goal = body.goal ?? "";
    const note =
      body.note ||
      [goal, notes].filter(Boolean).join(" · ") ||
      "Tap the circle when finished";

    const duration =
      body.duration ||
      goal ||
      (typeof body.note === "string" ? body.note.split("·")[0].trim() : "") ||
      "";

    const habit = await Habit.create({
      user: req.user._id, // Attach logged-in user's ID
      title,
      name: title,
      category: body.category || "Personal",
      frequency: body.frequency || "Every day",
      status: "Not Started",
      note,
      notes,
      goal,
      duration,
      reminderTime: body.reminderTime || "",
      iconName: body.iconName || "Goal",
      color: body.color || "green",
      current: 0,
      best: 0,
      thisWeek: 0,
      weekDone: Array(7).fill(false),
      completedDates: [],
      tag: "New habit",
      tagColor: "blue",
    });

    res.status(201).json({
      status: "success",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/habits/:id (User-scoped ownership check)
const updateHabit = async (req, res) => {
  try {
    const body = req.body || {};
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        status: "error",
        message: "Habit not found",
      });
    }

    // Ensure habit belongs to logged in user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized to update this habit",
      });
    }

    const updates = { ...body };

    if (updates.title) {
      updates.title = String(updates.title).trim();
      updates.name = updates.title;
    } else if (updates.name) {
      updates.name = String(updates.name).trim();
      updates.title = updates.name;
    }

    delete updates._id;
    delete updates.id;
    delete updates.__v;
    delete updates.user;
    delete updates.createdAt;
    delete updates.updatedAt;

    const updated = await Habit.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/habits/:id/toggle (User-scoped ownership check)
const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        status: "error",
        message: "Habit not found",
      });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized to modify this habit",
      });
    }

    const requestedDate = req.body?.date;
    const parsedDate =
      typeof requestedDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
        ? new Date(`${requestedDate}T00:00:00`)
        : null;
    const todayStr =
      parsedDate && formatLocalDateKey(parsedDate) === requestedDate
        ? requestedDate
        : getTodayDateString();
    const targetDate = new Date(`${todayStr}T00:00:00`);
    const todayIndex = (targetDate.getDay() + 6) % 7; // Mon=0 … Sun=6
    const dates = new Set(habit.completedDates || []);
    const goingComplete = !dates.has(todayStr);
    if (goingComplete) dates.add(todayStr);
    else dates.delete(todayStr);
    habit.completedDates = Array.from(dates).sort();

    const weekStart = new Date(targetDate);
    weekStart.setDate(weekStart.getDate() - todayIndex);
    const weekDone = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      return dates.has(formatLocalDateKey(date));
    });
    habit.weekDone = weekDone;

    const checkedCount = weekDone.filter(Boolean).length;
    habit.thisWeek = Math.round((checkedCount / 7) * 100);

    const streaks = calculateHabitStreaks(
      habit.completedDates,
      habit.frequency,
      targetDate
    );
    habit.current = streaks.current;
    habit.best = streaks.best;
    habit.status = goingComplete ? "Completed" : "Not Started";
    habit.tag = goingComplete ? "Completed Today" : "Needs Focus";
    habit.tagColor = goingComplete ? "green" : "orange";

    await habit.save();

    res.status(200).json({
      status: "success",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /api/habits/:id (User-scoped ownership check)
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        status: "error",
        message: "Habit not found",
      });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized to delete this habit",
      });
    }

    await habit.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Habit removed successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getHabits,
  getHabitsStats,
  getMonthlyStats,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
};