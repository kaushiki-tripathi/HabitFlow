import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useHabit from "../../hooks/useHabit";

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#2C261F] text-[#FFFCFA] text-xs py-2 px-3 rounded-xl shadow-lg border border-[#8C7465]/30 dark:bg-[#141210] dark:text-[#F4F0EA] dark:border-[#2F2A25]"
      >
        <p className="font-semibold">{label}</p>
        <p className="text-[#EFE5DB] font-medium dark:text-[#A08F7E]">
          Completion:{" "}
          <span className="text-[#FFFCFA] font-serif font-bold dark:text-[#F4F0EA]">
            {payload[0].value}%
          </span>
        </p>
      </motion.div>
    );
  }
  return null;
}

export default function ConsistencyTrend() {
  const { user } = useAuth();
  const { habits } = useHabit();
  const [selectedHabit, setSelectedHabit] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filterOptions = useMemo(
    () => [
      { id: "all", label: "All Habits" },
      ...habits.map((h) => ({
        id: h.id,
        label: h.title || h.name || "Untitled",
      })),
    ],
    [habits]
  );

  const currentLabel =
    filterOptions.find((o) => o.id === selectedHabit)?.label || "All Habits";

  const analytics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSinceJoin = user?.createdAt
      ? (today.getTime() - new Date(user.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
      : 0;

    const totalCompletions = habits.reduce(
      (acc, h) => acc + (h.completedDates?.length || 0),
      0
    );

    if (daysSinceJoin < 3 && totalCompletions === 0) {
      return { isEmptyState: true };
    }

    const current7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const prev7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (13 - i));
      return d;
    });

    const getCompletionsForDate = (dateObj) => {
      const dateStr = formatDateKey(dateObj);
      if (selectedHabit === "all") {
        return habits.filter((h) => h.completedDates?.includes(dateStr)).length;
      }
      const habit = habits.find((h) => h.id === selectedHabit);
      return habit?.completedDates?.includes(dateStr) ? 1 : 0;
    };

    const targetMax = selectedHabit === "all" ? Math.max(habits.length, 1) : 1;

    let currentCompletions = 0;
    const chartData = current7Days.map((date) => {
      const count = getCompletionsForDate(date);
      currentCompletions += count;
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        rate: Math.round((count / targetMax) * 100),
      };
    });

    let prevCompletions = 0;
    prev7Days.forEach((date) => {
      prevCompletions += getCompletionsForDate(date);
    });

    const currentRate = Math.round(
      (currentCompletions / (targetMax * 7)) * 100
    );
    const prevRate = Math.round((prevCompletions / (targetMax * 7)) * 100);
    const delta = currentRate - prevRate;

    let trend = "stable";
    if (delta >= 5) trend = "up";
    if (delta <= -5) trend = "down";

    return {
      isEmptyState: false,
      currentRate,
      delta,
      trend,
      chartData,
    };
  }, [habits, selectedHabit, user]);

  if (analytics.isEmptyState) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] rounded-3xl p-6 md:p-8 border border-[var(--border-color)] shadow-sm flex flex-col items-center justify-center text-center h-[360px] dark:border-[#2F2A25] dark:bg-[#1E1B18]"
      >
        <div className="w-14 h-14 bg-[var(--bg-subtle)] rounded-2xl flex items-center justify-center mb-4 text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]">
          <Target size={28} />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-[var(--text-main)] mb-2">
          Building your baseline
        </h3>
        <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm mb-6">
          You&apos;re at the very beginning of your journey! Check off habits for
          a few days to unlock your personalized trend graph.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--bg-card)] rounded-3xl p-5 sm:p-6 border border-[var(--border-color)] shadow-sm flex h-full min-h-[360px] flex-col dark:border-[#2F2A25] dark:bg-[#1E1B18]"
    >
      {/* Header Controls */}
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]">
            <Activity size={17} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-[var(--text-main)] sm:text-2xl">
              Consistency Trend
            </h2>
            <p className="text-[11px] font-medium text-[var(--text-muted)]">
              7-day analysis
            </p>
          </div>
        </div>

        {/* Matching Time Distribution filter dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex max-w-[140px] items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-[#8C7465]/40 focus:outline-none dark:border-[#2F2A25] dark:bg-[#27231F] cursor-pointer"
          >
            <span className="truncate">{currentLabel}</span>
            <ChevronDown
              size={13}
              className={`shrink-0 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-30 mt-1.5 max-h-56 w-44 overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-xl dark:border-[#2F2A25] dark:bg-[#241F1A]"
                >
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedHabit(opt.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        opt.id === selectedHabit
                          ? "bg-[#2C261F] text-[#F7F4EF] dark:bg-[#2F2A25] dark:text-[#FAF6F0]"
                          : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)] dark:hover:bg-[#2F2A25]"
                      }`}
                    >
                      <span className="truncate pr-2">{opt.label}</span>
                      {opt.id === selectedHabit && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C7465]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Stat & Delta Badge */}
      <div className="mb-4 flex items-end gap-3">
        <span className="font-serif text-4xl font-semibold text-[var(--text-main)]">
          {analytics.currentRate}%
        </span>

        <motion.div
          key={analytics.delta}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-1 flex items-center gap-1 rounded-lg bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] dark:bg-[#27231F] dark:text-[#A08F7E]"
        >
          {analytics.trend === "up" && <TrendingUp size={14} />}
          {analytics.trend === "down" && <TrendingDown size={14} />}
          {analytics.trend === "stable" && <Minus size={14} />}
          <span>
            {analytics.delta > 0 ? "+" : ""}
            {analytics.delta}% vs previous 7 days
          </span>
        </motion.div>
      </div>

      {/* Recharts Area Chart */}
      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={analytics.chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8C7465" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8C7465" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#8C7465"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}