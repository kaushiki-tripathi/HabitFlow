import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Footprints,
  Moon,
  Sparkles,
  RotateCcw,
  Minus,
  Target,
  Disc,
  Heart,
  Flame,
  Zap,
  Dumbbell,
  Coffee,
  Tv,
  Video,
  Play,
  Award,
  Sun,
  Smile,
  Activity,
  PenTool,
} from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Toast from "../components/ui/Toast";
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

// Dynamic Icon Map matching Habits and Dashboard components
const ICON_MAP = {
  Goal: Target,
  Target: Target,
  Disc: Disc,
  Book: BookOpen,
  BookOpen: BookOpen,
  Read: BookOpen,
  Brain: Brain,
  Study: Brain,
  Droplet: Droplets,
  Droplets: Droplets,
  Water: Droplets,
  Footprints: Footprints,
  Walk: Footprints,
  Sparkles: Sparkles,
  Moon: Moon,
  Heart: Heart,
  Flame: Flame,
  Zap: Zap,
  Dumbbell: Dumbbell,
  Coffee: Coffee,
  Tv: Tv,
  Video: Video,
  Play: Play,
  Award: Award,
  Sun: Sun,
  Smile: Smile,
  Activity: Activity,
  PenTool: PenTool,
};

function getHabitIcon(habit) {
  if (!habit) return Sparkles;

  // 1. Direct iconName match from database
  if (habit.iconName && ICON_MAP[habit.iconName]) {
    return ICON_MAP[habit.iconName];
  }

  // 2. Keyword fallback matching
  const title = (habit.title || habit.name || "").toLowerCase();
  const category = (habit.category || "").toLowerCase();

  if (title.includes("reel") || title.includes("watch") || title.includes("video")) return Target;
  if (title.includes("read") || title.includes("book")) return BookOpen;
  if (title.includes("water") || title.includes("drink")) return Droplets;
  if (title.includes("walk") || title.includes("run") || title.includes("step")) return Footprints;
  if (title.includes("study") || title.includes("learn") || title.includes("focus")) return Brain;
  if (title.includes("sleep") || title.includes("bed") || title.includes("night")) return Moon;

  if (category.includes("study")) return Brain;
  if (category.includes("health")) return Heart;
  if (category.includes("personal")) return Target;

  return Sparkles;
}

const HABIT_TONES = {
  blue: {
    checked: "bg-[#8C7465] border-[#8C7465] dark:bg-[#A89080] dark:border-[#A89080]",
    icon: "text-[#8C7465] bg-[#F1EAE2] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  },
  green: {
    checked: "bg-[#2C261F] border-[#2C261F] dark:bg-[#6F655C] dark:border-[#6F655C]",
    icon: "text-[#6F655C] bg-[#F4F0EA] dark:bg-[#27231F] dark:text-[#A08F7E]",
  },
  amber: {
    checked: "bg-[#A89080] border-[#A89080] dark:bg-[#8C7465] dark:border-[#8C7465]",
    icon: "text-[#8C7465] bg-[#EFE5DB] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  },
  purple: {
    checked: "bg-[#6F655C] border-[#6F655C] dark:bg-[#8A7B6C] dark:border-[#8A7B6C]",
    icon: "text-[#6F655C] bg-[#F1EAE2] dark:bg-[#27231F] dark:text-[#A08F7E]",
  },
  pink: {
    checked: "bg-[#8C7465] border-[#8C7465] dark:bg-[#A89080] dark:border-[#A89080]",
    icon: "text-[#8A7B6C] bg-[#F7F4EF] dark:bg-[#27231F] dark:text-[#A08F7E]",
  },
  indigo: {
    checked: "bg-[#2C261F] border-[#2C261F] dark:bg-[#6F655C] dark:border-[#6F655C]",
    icon: "text-[#2C261F] bg-[#E8DFD6] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  },
};

function getMonday(date) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function buildChecksFromHabits(habits, weekStart) {
  return Object.fromEntries(
    habits.map((habit) => [
      habit.id,
      WEEKDAYS.map((_, dayIndex) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + dayIndex);
        const dateStr = formatDateKey(date);
        return Boolean(habit.completedDates?.includes(dateStr));
      }),
    ])
  );
}

function formatRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const startMonth = monday.toLocaleDateString("en", { month: "short" });
  const endMonth = sunday.toLocaleDateString("en", { month: "short" });
  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const year = sunday.getFullYear();
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

export default function Weekly() {
  const { user } = useAuth();
  const { habits, loading, toggleHabit } = useHabit();
  const [today, setToday] = useState(() => new Date());
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [toastMessage, setToastMessage] = useState("");

  const currentWeekStart = useMemo(() => getMonday(today), [today]);

  const minWeekStart = useMemo(() => {
    if (!user?.createdAt) return getMonday(today);
    return getMonday(new Date(user.createdAt));
  }, [user?.createdAt, today]);

  const isAtMinWeek = weekStart.getTime() <= minWeekStart.getTime();
  const isAtCurrentWeek = weekStart.getTime() >= currentWeekStart.getTime();

  // End of current displayed week (Sunday 23:59:59)
  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekStart]);

  // FILTER: Only show habits created ON OR BEFORE the end of this displayed week
  const visibleHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (!habit.createdAt) return true;
      const createdStart = startOfDay(habit.createdAt);
      return createdStart <= weekEnd;
    });
  }, [habits, weekEnd]);

  const checkedDays = useMemo(
    () => buildChecksFromHabits(visibleHabits, weekStart),
    [visibleHabits, weekStart]
  );

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0);
    const timeoutId = window.setTimeout(() => {
      const nextToday = new Date();
      setToday(nextToday);
    }, nextDay.getTime() - now.getTime());

    return () => window.clearTimeout(timeoutId);
  }, []);

  const todayStart = useMemo(() => startOfDay(today), [today]);

  const weekDates = useMemo(() => {
    return WEEKDAYS.map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, [weekStart]);

  // Exclude pre-creation days from denominators
  const { totalDoneChecks, totalEligibleChecks, habitStats } = useMemo(() => {
    let totalDone = 0;
    let totalEligible = 0;
    const stats = {};

    visibleHabits.forEach((habit) => {
      const createdStart = habit.createdAt ? startOfDay(habit.createdAt) : null;
      let habitEligible = 0;
      let habitDone = 0;

      WEEKDAYS.forEach((_, dayIndex) => {
        const dayDate = startOfDay(weekDates[dayIndex]);
        const isBeforeCreation = createdStart ? dayDate < createdStart : false;

        if (!isBeforeCreation) {
          habitEligible += 1;
          if (checkedDays[habit.id]?.[dayIndex]) {
            habitDone += 1;
          }
        }
      });

      stats[habit.id] = {
        eligibleCount: habitEligible,
        doneCount: habitDone,
        percent:
          habitEligible > 0
            ? Math.round((habitDone / habitEligible) * 100)
            : 0,
      };

      totalDone += habitDone;
      totalEligible += habitEligible;
    });

    return {
      totalDoneChecks: totalDone,
      totalEligibleChecks: totalEligible,
      habitStats: stats,
    };
  }, [visibleHabits, weekDates, checkedDays]);

  const weeklyPercent =
    totalEligibleChecks > 0
      ? Math.round((totalDoneChecks / totalEligibleChecks) * 100)
      : 0;

  const toggleDay = (habitId, dayIndex) => {
    if (weekDates[dayIndex].getTime() !== todayStart.getTime()) return;
    const wasChecked = Boolean(checkedDays[habitId]?.[dayIndex]);
    const habit = visibleHabits.find((item) => item.id === habitId);
    toggleHabit(habitId);
    if (!wasChecked && habit) {
      setToastMessage(`${habit.title ?? habit.name} done for today.`);
    }
  };

  const handlePrevWeek = () => {
    if (isAtMinWeek) return;
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    if (isAtCurrentWeek) return;
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleCurrentWeek = () => {
    setWeekStart(currentWeekStart);
  };

  if (loading) return <Pageskeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-36 text-[var(--text-main)] sm:px-6 lg:px-8 lg:pt-28">
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        <Card className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors duration-300 dark:border-[#2F2A25] dark:bg-[#1E1B18] sm:p-6 lg:p-8">
          {/* Header with Week Navigation Controls */}
          <motion.header
            variants={fadeUpVariants}
            className="mb-6 flex flex-col gap-4 border-b border-[var(--border-color)] pb-5 dark:border-[#2F2A25] md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="font-serif text-4xl font-semibold text-[var(--text-main)]">
                Weekly View
              </h1>
              <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
                {isAtCurrentWeek
                  ? "Tap today’s cell to toggle your habit status."
                  : "Historical record view. Showing past activity."}
              </p>
            </div>

            {/* Navigator Pills */}
            <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-1.5 transition-colors dark:border-[#2F2A25] dark:bg-[#27231F] md:self-auto">
              <button
                type="button"
                onClick={handlePrevWeek}
                disabled={isAtMinWeek}
                className="rounded-xl p-2 text-[var(--text-main)] transition-colors hover:bg-[#E8DFD6]/60 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-[#3A322A]"
                title="Previous Week"
                aria-label="Previous Week"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="min-w-44 px-3 py-0.5 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-color)]">
                  {isAtCurrentWeek ? "Current Week" : "Past Week"}
                </span>
                <span className="block text-xs font-semibold text-[var(--text-main)]">
                  {formatRange(weekStart)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextWeek}
                disabled={isAtCurrentWeek}
                className="rounded-xl p-2 text-[var(--text-main)] transition-colors hover:bg-[#E8DFD6]/60 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-[#3A322A]"
                title="Next Week"
                aria-label="Next Week"
              >
                <ChevronRight size={18} />
              </button>

              {!isAtCurrentWeek && (
                <button
                  type="button"
                  onClick={handleCurrentWeek}
                  className="ml-1 flex items-center gap-1 rounded-xl bg-[#2C261F] px-3 py-1.5 text-xs font-medium text-[#FFFCFA] transition-colors hover:bg-[#8C7465] dark:bg-[#3A322A] dark:text-[#F4F0EA] dark:hover:bg-[#4A4038]"
                  title="Return to Current Week"
                >
                  <RotateCcw size={12} />
                  <span>Today</span>
                </button>
              )}
            </div>
          </motion.header>

          <motion.div
            variants={fadeUpVariants}
            className="custom-scrollbar overflow-x-auto"
          >
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)] dark:border-[#2F2A25]">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-[210px] bg-[var(--bg-card)] px-3 py-3 text-sm font-semibold text-[var(--text-muted)] dark:bg-[#1E1B18]"
                  >
                    Habit
                  </th>
                  {WEEKDAYS.map((weekday, index) => {
                    const date = weekDates[index];
                    const isTodayCol = date.getTime() === todayStart.getTime();
                    return (
                      <th
                        key={weekday + index}
                        scope="col"
                        className="min-w-[72px] px-2 py-3 text-center"
                      >
                        <span
                          className={`block text-sm font-medium ${
                            isTodayCol
                              ? "text-[var(--accent-color)] font-semibold"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {weekday}
                        </span>
                        <span className="mt-0.5 block text-base font-semibold text-[var(--text-main)]">
                          {date.getDate()}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {visibleHabits.length > 0 ? (
                  visibleHabits.map((habit) => {
                    const label = habit.title ?? habit.name;
                    const Icon = getHabitIcon(habit);
                    const tone = HABIT_TONES[habit.color] ?? HABIT_TONES.green;
                    const checks = checkedDays[habit.id] ?? [];
                    const stat = habitStats[habit.id] ?? {
                      doneCount: 0,
                      eligibleCount: 7,
                      percent: 0,
                    };

                    return (
                      <tr
                        key={habit.id}
                        className="border-b border-[var(--border-color)] last:border-b-0 dark:border-[#2F2A25]"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-[var(--bg-card)] px-3 py-3 text-left font-normal dark:bg-[#1E1B18]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                            >
                              <Icon size={16} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
                                {label}
                              </span>
                              <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                                {stat.doneCount}/{stat.eligibleCount} · {stat.percent}%
                              </span>
                            </span>
                          </div>
                        </th>

                        {WEEKDAYS.map((weekday, dayIndex) => {
                          const dayDate = startOfDay(weekDates[dayIndex]);
                          const createdStart = habit.createdAt
                            ? startOfDay(habit.createdAt)
                            : null;
                          const isBeforeCreation = createdStart
                            ? dayDate < createdStart
                            : false;

                          const isFuture = dayDate > todayStart;
                          const isPast = dayDate < todayStart;
                          const isToday = !isFuture && !isPast;
                          const checked = Boolean(checks[dayIndex]);

                          return (
                            <td
                              key={weekday + dayIndex}
                              className="px-2 py-2.5 text-center"
                            >
                              <button
                                type="button"
                                disabled={!isToday || isBeforeCreation}
                                aria-label={`${label}, ${weekday}: ${
                                  isBeforeCreation
                                    ? "Not created yet"
                                    : isFuture
                                    ? "upcoming"
                                    : isPast
                                    ? `past, ${
                                        checked ? "completed" : "not completed"
                                      }`
                                    : checked
                                    ? "completed"
                                    : "not completed"
                                }`}
                                aria-pressed={checked}
                                onClick={() => toggleDay(habit.id, dayIndex)}
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFCFA] dark:focus-visible:ring-offset-[#1E1B18] disabled:cursor-not-allowed ${
                                  isBeforeCreation
                                    ? "border-transparent bg-[var(--bg-subtle)] text-[var(--text-muted)]/40 opacity-40 dark:bg-[#27231F]"
                                    : checked
                                    ? `${tone.checked} text-[#FFFCFA] dark:text-[#F4F0EA]`
                                    : !isToday
                                    ? "border-[#E8DFD6] bg-[#F4F0EA] text-transparent opacity-55 dark:border-[#3A322A] dark:bg-[#27231F]"
                                    : "border-[#E8DFD6] bg-[#F7F4EF] text-transparent cursor-pointer hover:border-[#8C7465] dark:border-[#3A322A] dark:bg-[#27231F] dark:hover:border-[#8C7465]"
                                }`}
                              >
                                {isBeforeCreation ? (
                                  <Minus size={14} className="opacity-60" />
                                ) : (
                                  checked && <Check size={17} strokeWidth={2.5} />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-sm font-medium text-[var(--text-muted)]"
                    >
                      No rituals existed during this week.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="border-t border-[var(--border-color)] dark:border-[#2F2A25]">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[var(--bg-card)] px-3 py-4 text-xs font-semibold text-[var(--text-main)] dark:bg-[#1E1B18]"
                  >
                    Weekly Completion Rate
                  </th>
                  <td colSpan={7} className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EFE5DB] dark:bg-[#27231F]"
                        role="progressbar"
                        aria-label="Weekly Completion Rate"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={weeklyPercent}
                      >
                        <div
                          className="h-full rounded-full bg-[#8C7465] transition-[width] duration-300"
                          style={{ width: `${weeklyPercent}%` }}
                        />
                      </div>
                      <span className="font-serif text-sm font-semibold text-[var(--text-main)]">
                        {weeklyPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </motion.div>
        </Card>
      </motion.div>

      <Toast
        message={toastMessage}
        type="success"
        visible={Boolean(toastMessage)}
      />
    </main>
  );
}