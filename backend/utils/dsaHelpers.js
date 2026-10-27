/**
 * DSA Helper Functions for HabitFlow Analytics
 */

// Helper to get YYYY-MM-DD string for today's date
const formatDateString = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

/**
 * DSA Task 1: Real Date-Based Streak Calculation Algorithm
 * Calculates current active streak and max historical streak from array of completed date strings ("YYYY-MM-DD").
 * Time Complexity: O(D log D) due to sorting, where D = number of completed dates.
 * Space Complexity: O(D) for storing unique dates.
 */
const calculateStreaks = (completedDates = []) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const uniqueDates = Array.from(new Set(completedDates)).sort();

  let maxStreak = 0;
  let tempStreak = 0;
  let prevDateMs = null;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (const dateStr of uniqueDates) {
    const currentMs = new Date(dateStr).getTime();

    if (prevDateMs === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentMs - prevDateMs) / ONE_DAY_MS);
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, tempStreak);
    prevDateMs = currentMs;
  }

  const todayStr = formatDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateString(yesterday);

  const dateSet = new Set(uniqueDates);
  let currentStreak = 0;

  if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
    let checkDate = dateSet.has(todayStr) ? new Date() : yesterday;
    while (dateSet.has(formatDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return { currentStreak, bestStreak: maxStreak };
};

/**
 * DSA Task 2: Single-Pass Dashboard Stats Aggregation Algorithm
 * Calculates overall dashboard stats in a single pass O(N) over habits array.
 * Time Complexity: O(N) where N is total habits.
 * Space Complexity: O(1) auxiliary space.
 */
const aggregateDashboardStats = (habits = []) => {
  const totalTracked = habits.length;
  let completedToday = 0;
  let overallBestStreak = 0;
  let totalWeeklyPercentage = 0;

  for (let i = 0; i < habits.length; i++) {
    const habit = habits[i];

    if (habit.status === "Completed") {
      completedToday++;
    }

    if (habit.best > overallBestStreak) {
      overallBestStreak = habit.best;
    }

    totalWeeklyPercentage += Number(habit.thisWeek) || 0;
  }

  const avgWeeklyProgress =
    totalTracked > 0 ? Math.round(totalWeeklyPercentage / totalTracked) : 0;

  return [
    {
      title: "Habits Tracked",
      value: String(totalTracked),
      sub: `${totalTracked} total active habits`,
    },
    {
      title: "Completed Today",
      value: `${completedToday} / ${totalTracked}`,
      sub: `${totalTracked - completedToday} remaining`,
    },
    {
      title: "Best Streak",
      value: `${overallBestStreak} days`,
      sub: "keep it alive 🔥",
    },
    {
      title: "Weekly Progress",
      value: `${avgWeeklyProgress}%`,
      sub: "Overall completion rate",
    },
  ];
};

/**
 * DSA Task 3: Monthly Activity Histogram & Frequency Map Algorithm
 * Aggregates daily completion counts for a specific month across all habits.
 * Time Complexity: O(N * D) where N = habits, D = completed dates per habit.
 * Space Complexity: O(DaysInMonth) ~ O(1) auxiliary space (max 31 days).
 */
const buildMonthlyHistogram = (
  habits = [],
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  const dailyCounts = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(dayNum).padStart(2, "0");
    return {
      day: dayNum,
      date: `${year}-${formattedMonth}-${formattedDay}`,
      completedCount: 0,
    };
  });

  const dateMap = new Map();
  dailyCounts.forEach((item) => dateMap.set(item.date, item));

  let totalCompletions = 0;

  for (const habit of habits) {
    if (Array.isArray(habit.completedDates)) {
      for (const dateStr of habit.completedDates) {
        if (dateMap.has(dateStr)) {
          dateMap.get(dateStr).completedCount += 1;
          totalCompletions += 1;
        }
      }
    }
  }

  const totalPossible = habits.length * daysInMonth;
  const monthlyRate =
    totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  return {
    year,
    month,
    daysInMonth,
    totalCompletions,
    monthlyCompletionRate: monthlyRate,
    histogram: dailyCounts,
  };
};

module.exports = {
  formatDateString,
  calculateStreaks,
  aggregateDashboardStats,
  buildMonthlyHistogram,
};