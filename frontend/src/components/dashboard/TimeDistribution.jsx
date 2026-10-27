import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PieChart, Sparkles } from "lucide-react";

const THEME_PALETTE = [
  "#8C7465",
  "#C4A78D",
  "#9EA893",
  "#5C4A3E",
  "#B8906F",
  "#7A6B5D",
  "#D9CAB8",
  "#6E7B68",
];

function parseDurationMinutes(habit) {
  if (!habit) return 20;

  if (typeof habit.duration === "number" && !isNaN(habit.duration) && habit.duration > 0) {
    return habit.duration;
  }

  const text = [
    habit.duration,
    habit.goal,
    habit.notes,
    habit.note,
    habit.title,
    habit.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hour|hours|hr|hrs|h)\b/i);
  const minMatch = text.match(/(\d+)\s*(?:minute|minutes|mins|min|m)\b/i);

  let totalMinutes = 0;
  if (hourMatch) totalMinutes += parseFloat(hourMatch[1]) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1], 10);

  if (totalMinutes > 0) return Math.min(totalMinutes, 480);

  const numberMatch = text.match(/\b(\d+)\b/);
  if (numberMatch) {
    const val = parseInt(numberMatch[1], 10);
    if (val <= 15) return 15;
    return Math.min(val, 120);
  }

  return 20;
}

function formatMinutes(mins) {
  if (!mins || mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function TimeDistribution({ habits = [] }) {
  const [filterMode, setFilterMode] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const distribution = useMemo(() => {
    const activeHabits = habits.filter((h) => h.status !== "Paused");

    if (!habits || habits.length === 0 || activeHabits.length === 0) {
      return {
        totalMinutes: 0,
        totalFormatted: "0m",
        label: "Planned",
        items: [],
        isEmpty: true,
      };
    }

    let targetHabits = activeHabits;
    if (filterMode === "completed") {
      targetHabits = activeHabits.filter((h) => h.status === "Completed");
      if (targetHabits.length === 0) {
        return {
          totalMinutes: 0,
          totalFormatted: "0m",
          label: "Done",
          items: [],
          isEmptyCompleted: true,
        };
      }
    }

    const habitMap = {};
    let grandTotalMinutes = 0;

    targetHabits.forEach((habit) => {
      const habitName = habit.title || habit.name || "Unnamed Ritual";
      const baseMins = parseDurationMinutes(habit);

      let multiplier = 1;
      if (filterMode === "weekly") {
        const freq = (habit.frequency || "").toLowerCase();
        if (freq.includes("every day") || freq.includes("daily")) multiplier = 7;
        else if (freq.includes("weekday")) multiplier = 5;
        else if (freq.includes("weekend")) multiplier = 2;
        else multiplier = 4;
      }

      const habitTotalMins = baseMins * multiplier;

      if (!habitMap[habitName]) habitMap[habitName] = { minutes: 0 };
      habitMap[habitName].minutes += habitTotalMins;
      grandTotalMinutes += habitTotalMins;
    });

    if (grandTotalMinutes === 0) {
      return {
        totalMinutes: 0,
        totalFormatted: "0m",
        label: filterMode === "completed" ? "Done" : "Planned",
        items: [],
        isEmpty: true,
      };
    }

    const sortedEntries = Object.entries(habitMap).sort(
      (a, b) => b[1].minutes - a[1].minutes
    );

    let accumulatedPercent = 0;
    const items = sortedEntries.map(([name, data], index) => {
      const isLast = index === sortedEntries.length - 1;
      const exactPct = Math.round((data.minutes / grandTotalMinutes) * 100);
      const percentage = isLast
        ? Math.max(0, 100 - accumulatedPercent)
        : exactPct;
      accumulatedPercent += percentage;

      return {
        label: name,
        minutes: data.minutes,
        percentage,
        color: THEME_PALETTE[index % THEME_PALETTE.length],
      };
    });

    return {
      totalMinutes: grandTotalMinutes,
      totalFormatted: formatMinutes(grandTotalMinutes),
      label:
        filterMode === "completed"
          ? "Done"
          : filterMode === "weekly"
          ? "Weekly"
          : "All",
      items,
      isEmpty: false,
    };
  }, [habits, filterMode]);

  // Expanded circle geometry
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  let cumulativePct = 0;
  const segments =
    distribution.items?.map((item, index) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulativePct / 100) * circumference);
      cumulativePct += item.percentage;
      return { ...item, strokeDasharray, strokeDashoffset, index };
    }) || [];

  const filterOptions = [
    { id: "all", label: "Today" },
    { id: "completed", label: "Completed" },
    { id: "weekly", label: "Weekly" },
  ];

  const currentLabel =
    filterOptions.find((o) => o.id === filterMode)?.label || "Today";

  const needsScroll = (distribution.items?.length || 0) > 4;

  return (
    <div className="flex h-[360px] flex-col rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-colors duration-300 sm:p-6 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]">
            <PieChart size={16} strokeWidth={2.2} />
          </span>
          <h2 className="font-serif text-xl text-[var(--text-main)] sm:text-2xl">
            Time Distribution
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-[#8C7465]/40 focus:outline-none dark:border-[#2F2A25] dark:bg-[#27231F]"
          >
            <span>{currentLabel}</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${
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
                  className="absolute right-0 top-full z-30 mt-1.5 w-32 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-xl dark:border-[#2F2A25] dark:bg-[#241F1A]"
                >
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setFilterMode(opt.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        opt.id === filterMode
                          ? "bg-[#2C261F] text-[#F7F4EF] dark:bg-[#2F2A25] dark:text-[#FAF6F0]"
                          : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)] dark:hover:bg-[#2F2A25]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.id === filterMode && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8C7465]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      {distribution.isEmpty ? (
        <div className="my-auto flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]">
            <Sparkles size={18} />
          </div>
          <p className="font-serif text-base text-[var(--text-main)]">
            No active rituals
          </p>
          <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-[var(--text-muted)]">
            Add rituals to see your live time breakdown.
          </p>
        </div>
      ) : distribution.isEmptyCompleted ? (
        <div className="my-auto flex flex-col items-center justify-center px-4 text-center">
          <p className="font-serif text-base text-[var(--text-main)]">
            0m Completed
          </p>
          <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-[var(--text-muted)]">
            Check off rituals in Today&apos;s Focus to log completed time.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 items-center gap-5 sm:gap-8">
          {/* Donut — BIGGER size (180px / 195px) */}
          <div className="relative flex h-[148px] w-[148px] shrink-0 items-center justify-center sm:h-[160px] sm:w-[160px]">

            <svg
              className="h-full w-full -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="20"
                className="text-[var(--bg-subtle)] dark:text-[#27231F]"
              />
              {segments.map((seg) => {
                const isHovered = hoveredIndex === seg.index;
                return (
                  <circle
                    key={seg.label}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 23 : 20}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(seg.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-[1.5rem] font-semibold leading-none tracking-tight text-[var(--text-main)] sm:text-[1.65rem]">
                {hoveredIndex !== null
                  ? formatMinutes(distribution.items[hoveredIndex]?.minutes)
                  : distribution.totalFormatted}
              </span>
              <span className="mt-1.5 max-w-[100px] truncate text-[11px] font-medium text-[var(--text-muted)]">
                {hoveredIndex !== null
                  ? distribution.items[hoveredIndex]?.label
                  : distribution.label}
              </span>
            </div>
          </div>

          {/* Legend — Constrained width so % stays close to habit names */}
          <div
            className={`min-h-0 max-w-[200px] flex-1 space-y-2.5 pr-1 ${
              needsScroll
                ? "custom-scrollbar max-h-[200px] overflow-y-auto"
                : "overflow-visible"
            }`}
          >
            {distribution.items.map((item, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group flex cursor-pointer items-center justify-between gap-3 transition-transform duration-150 ${
                    isHovered ? "translate-x-0.5" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200"
                      style={{
                        backgroundColor: item.color,
                        transform: isHovered ? "scale(1.25)" : "scale(1)",
                      }}
                    />
                    <div className="min-w-0 truncate">
                      <p
                        className={`truncate text-[12px] leading-tight transition-colors sm:text-[13px] ${
                          isHovered
                            ? "font-semibold text-[var(--text-main)]"
                            : "font-medium text-[var(--text-main)]"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-[10px] leading-tight text-[var(--text-muted)]">
                        {formatMinutes(item.minutes)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 font-serif text-[13px] font-semibold tabular-nums text-[var(--text-main)]">
                    {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}