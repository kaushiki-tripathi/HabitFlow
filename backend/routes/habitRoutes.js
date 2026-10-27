const express = require("express");
const {
  getHabits,
  getHabitsStats,
  getMonthlyStats,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
} = require("../controllers/habitController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);


router.route("/").get(getHabits).post(createHabit);

// Special static routes must come BEFORE dynamic /:id routes
router.get("/stats", getHabitsStats);
router.get("/monthly", getMonthlyStats);

router.patch("/:id/toggle", toggleHabit);
router.route("/:id").patch(updateHabit).delete(deleteHabit);

module.exports = router;