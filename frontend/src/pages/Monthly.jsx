import { useMemo, useState } from "react";
import {
  CalendarCheck,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import useHabit from "../hooks/useHabit";
import { useAuth } from "../context/AuthContext";
import Pageskeleton from "../components/ui/Skeleton";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const WEEKDAYS = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
const INTENSITY_COLORS = [
  "var(--monthly-level-0)",
  "var(--monthly-level-1)",
  "var(--monthly-level-2)",
  "var(--monthly-level-3)",
  "var(--monthly-level-4)",
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toDateKey(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

function buildMonthGrid(year, month) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7)
  );
}

/**
 * Real monthly activity from habit.completedDates ("YYYY-MM-DD")
 */
function buildMonthlyActivity(year, month, maxDay, habitsList) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activity = {};
  const completedHabitsByDay = {};
  const habitTotals = {};
  const weekdayTotals = Array(7).fill(0);

  let actionTotal = 0;
  let activeDays = 0;

  // Init day buckets
  for (let day = 1; day <= daysInMonth; day += 1) {
    activity[day] = 0;
    completedHabitsByDay[day] = [];
  }

  if (!habitsList || habitsList.length === 0) {
    return {
      activity,
      completedHabitsByDay,
      actionTotal: 0,
      bestHabit: "No activity yet",
      mostConsistentDay: "No activity yet",
      completionRate: 0,
    };
  }

  habitsList.forEach((habit) => {
    const habitName = habit.title ?? habit.name ?? "Untitled";
    if (!habitTotals[habitName]) habitTotals[habitName] = 0;

    const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
    dates.forEach((dateStr) => {
      if (typeof dateStr !== "string" || dateStr.length < 10) return;

      const [y, m, d] = dateStr.split("-").map(Number);
      if (y !== year || m !== month + 1) return;
      if (!d || d < 1 || d > daysInMonth) return;
      if (d > maxDay) return; // don't count future days in current month

      activity[d] += 1;
      actionTotal += 1;
      habitTotals[habitName] += 1;

      if (!completedHabitsByDay[d].includes(habitName)) {
        completedHabitsByDay[d].push(habitName);
      }

      const weekdayIndex = (new Date(year, month, d).getDay() + 6) % 7;
      weekdayTotals[weekdayIndex] += 1;
    });
  });

  for (let day = 1; day <= Math.min(daysInMonth, maxDay); day += 1) {
    if ((activity[day] ?? 0) > 0) activeDays += 1;
  }

  // Cap intensity color index at 4
  Object.keys(activity).forEach((day) => {
    activity[day] = Math.min(activity[day], 4);
  });

  // Most Consistent Day Logic (Rate-based to handle months with 5 Tuesdays vs 4 Mondays)
  const WEEKDAY_FULL = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weekdayOccurrences = Array(7).fill(0);
  for (let day = 1; day <= Math.min(daysInMonth, maxDay); day += 1) {
    const weekdayIndex = (new Date(year, month, day).getDay() + 6) % 7;
    weekdayOccurrences[weekdayIndex] += 1;
  }

  let bestWeekdayIdx = -1;
  let bestRate = -1;
  let bestCount = -1;
  
  for (let i = 0; i < 7; i += 1) {
    const count = weekdayTotals[i];
    const occ = weekdayOccurrences[i] || 1;
    const rate = count / occ;
    
    if (rate > bestRate || (rate === bestRate && count > bestCount)) {
      bestRate = rate;
      bestCount = count;
      bestWeekdayIdx = i;
    }
  }

  const bestHabitEntry = Object.entries(habitTotals).sort(
    (left, right) => right[1] - left[1]
  )[0];
  const bestHabit =
    bestHabitEntry && bestHabitEntry[1] > 0
      ? bestHabitEntry[0]
      : "No activity yet";

  const mostConsistentDay =
    bestWeekdayIdx >= 0 && bestCount > 0
      ? WEEKDAY_FULL[bestWeekdayIdx]
      : "No activity yet";

  const denom = Math.max(1, Math.min(daysInMonth, maxDay));
  const completionRate = Math.round((activeDays / denom) * 100);

  return {
    activity,
    completedHabitsByDay,
    actionTotal,
    bestHabit,
    mostConsistentDay,
    completionRate,
  };
}

export default function Analytics() {
  const { user } = useAuth();
  const { habits, loading } = useHabit();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [displayedMonth, setDisplayedMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const isFutureMonth =
    displayedMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  const lastTrackedDay = isCurrentMonth
    ? today.getDate()
    : isFutureMonth
      ? 0
      : new Date(year, month + 1, 0).getDate();

  const monthlyActivity = useMemo(
    () => buildMonthlyActivity(year, month, lastTrackedDay, habits),
    [year, month, lastTrackedDay, habits]
  );

  const monthName = displayedMonth.toLocaleDateString("en", { month: "long" });
  const monthTitle = displayedMonth.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });

  const minMonthDate = useMemo(() => {
    if (!user?.createdAt) {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    const created = new Date(user.createdAt);
    return new Date(created.getFullYear(), created.getMonth(), 1);
  }, [user?.createdAt, today]);

  const canAdvance =
    displayedMonth < new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoBack = displayedMonth > minMonthDate;

  const changeMonth = (offset) => {
    const nextMonth = new Date(year, month + offset, 1);
    if (nextMonth > new Date(today.getFullYear(), today.getMonth(), 1)) return;
    if (nextMonth < minMonthDate) return;
    setDisplayedMonth(nextMonth);
    setSelectedDay(null);
  };

  const summaryCards = [
    {
      label: "Completed this month",
      value: `${monthlyActivity.actionTotal} habit actions`,
      icon: ChartNoAxesCombined,
    },
    {
      label: "Best habit",
      value: monthlyActivity.bestHabit,
      icon: Trophy,
    },
    {
      label: "Most consistent day",
      value: monthlyActivity.mostConsistentDay,
      icon: CalendarCheck,
    },
  ];

  if (loading) return <Pageskeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-36 text-[var(--text-main)] sm:px-6 lg:px-8 lg:pt-28">
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        <motion.header variants={fadeUpVariants} className="mb-5">
          <h1 className="font-serif text-4xl font-semibold text-[var(--text-main)]">
            Monthly progress
          </h1>
          <p className="mt-2 font-medium text-[var(--text-muted)]">
            Warm tones show how much of each day you completed
          </p>
        </motion.header>

        <motion.section
          variants={fadeUpVariants}
          className="mb-5 grid gap-3 sm:grid-cols-3"
        >
          {summaryCards.map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="flex min-h-24 items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors duration-300 sm:p-5 dark:border-[#2F2A25] dark:bg-[#1E1B18]"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
                <p className="mt-1 truncate font-serif text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                  {value}
                </p>
              </div>
              <span className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EAE2] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]">
                <Icon size={20} />
              </span>
            </Card>
          ))}
        </motion.section>

        <motion.div variants={fadeUpVariants}>
          <Card className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors duration-300 dark:border-[#2F2A25] dark:bg-[#1E1B18] sm:p-6 lg:p-7">
            <header className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  disabled={!canGoBack}
                  aria-label="Previous month"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] transition hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3A322A] dark:bg-[#1E1B18] dark:hover:bg-[#27231F]"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="font-serif text-lg font-semibold text-[var(--text-main)] sm:text-xl">
                  {monthTitle}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-semibold text-[#8C7465] dark:text-[#C4B2A0]">
                  {monthlyActivity.completionRate}%
                </span>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  disabled={!canAdvance}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] transition hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3A322A] dark:bg-[#1E1B18] dark:hover:bg-[#27231F]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEKDAYS.map((weekday) => (
                <div
                  key={weekday}
                  className="pb-1.5 text-center text-[10px] font-medium text-[var(--text-muted)] sm:text-sm"
                >
                  {weekday}
                </div>
              ))}

              {monthGrid.flatMap((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  if (day === null) {
                    return (
                      <span
                        key={`blank-${weekIndex}-${dayIndex}`}
                        className="min-h-10 rounded-lg sm:min-h-12"
                      />
                    );
                  }

                  const intensity = monthlyActivity.activity[day] ?? 0;
                  const isFuture = day > lastTrackedDay;
                  const isSelected = day === selectedDay;
                  const completedHabits =
                    monthlyActivity.completedHabitsByDay[day] ?? [];

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isFuture}
                      aria-label={`${monthTitle} ${day}: ${
                        isFuture
                          ? "not tracked yet"
                          : completedHabits.length
                            ? `completed ${completedHabits.join(", ")}`
                            : "no completed habits"
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedDay(day)}
                      className={`group relative flex min-h-10 items-center justify-center rounded-lg border text-xs transition-colors sm:min-h-12 sm:text-sm ${
                        isSelected
                          ? "border-[#8C7465] ring-1 ring-[#8C7465] dark:border-[#C4B2A0] dark:ring-[#C4B2A0]"
                          : "border-transparent"
                      } ${
                        isFuture
                          ? "cursor-default bg-[#F7F4EF] text-[#C4B2A0] dark:bg-[#27231F] dark:text-[#6F655C]"
                          : "text-[var(--text-main)] hover:border-[#C4B2A0] dark:hover:border-[#A89080]"
                      }`}
                      style={{
                        backgroundColor: isFuture
                          ? undefined
                          : INTENSITY_COLORS[Math.min(intensity, 4)],
                      }}
                    >
                      {day}
                      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-max max-w-56 -translate-x-1/2 rounded-lg border border-[#8C7465]/30 bg-[#2C261F] px-3 py-2 text-left text-xs leading-5 text-[#FFFCFA] shadow-lg group-hover:block group-focus-visible:block dark:border-[#3A322A] dark:bg-[#141210] dark:text-[#F4F0EA]">
                        {isFuture
                          ? "Activity has not been recorded yet."
                          : completedHabits.length
                            ? `Completed: ${completedHabits.join(", ")}`
                            : "No completed habits."}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <footer className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <span>Less</span>
              {INTENSITY_COLORS.map((color, index) => (
                <span
                  key={color}
                  aria-label={`Activity level ${index}`}
                  className="h-3.5 w-3.5 rounded border border-[var(--border-color)]"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
              <span aria-hidden="true" className="ml-1 text-base text-[var(--text-muted)]">
                ⟶
              </span>
              {selectedDay && (
                <span className="ml-2 text-[var(--text-muted)]">
                  {monthName} {selectedDay}:{" "}
                  {(monthlyActivity.completedHabitsByDay[selectedDay] || []).length}{" "}
                  habit
                  {(monthlyActivity.completedHabitsByDay[selectedDay] || [])
                    .length === 1
                    ? ""
                    : "s"}
                </span>
              )}
            </footer>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}