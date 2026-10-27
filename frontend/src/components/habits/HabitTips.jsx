import React, { useMemo } from "react";
import { Sparkles, TrendingUp, Target, Zap, RotateCcw } from "lucide-react";
import { useHabit } from "../../hooks/useHabit";

export default function HabitTips() {
  const { habits } = useHabit();

  const dynamicTips = useMemo(() => {
    if (!habits || habits.length === 0) {
      return [
        {
          id: "get-started",
          icon: Target,
          title: "Start Small",
          text: "Begin with 1–2 tiny habits. Consistency before intensity.",
          tag: "Beginner",
        },
        {
          id: "two-min-rule",
          icon: Sparkles,
          title: "2-Minute Rule",
          text: "Shrink the habit until it takes under 2 minutes.",
          tag: "Strategy",
        },
      ];
    }

    const totalHabits = habits.length;
    const maxStreak = Math.max(...habits.map((h) => h.best || 0), 0);
    const avgWeeklyPct = Math.round(
      habits.reduce((acc, h) => acc + (h.thisWeek || 0), 0) / totalHabits
    );
    const completedToday = habits.filter((h) => h.status === "Completed").length;

    const tipsList = [];

    if (maxStreak >= 5) {
      tipsList.push({
        id: "streak-fire",
        icon: Zap,
        title: `${maxStreak}-Day Streak`,
        text: "Protect it — do your priority habit early today.",
        tag: "Momentum",
      });
    } else {
      tipsList.push({
        id: "build-streak",
        icon: Zap,
        title: "Focus on Streaks",
        text: "Hit at least one core habit daily for momentum.",
        tag: "Focus",
      });
    }

    if (avgWeeklyPct < 50) {
      tipsList.push({
        id: "habit-stacking",
        icon: Sparkles,
        title: "Habit Stacking",
        text: "After coffee → do your next habit.",
        tag: "Optimize",
      });
    } else {
      tipsList.push({
        id: "high-rate",
        icon: TrendingUp,
        title: "High Performance",
        text: `${avgWeeklyPct}% this week — nudge targets up slightly.`,
        tag: "Growth",
      });
    }

    tipsList.push({
      id: "never-miss-twice",
      icon: RotateCcw,
      title: "Never Miss Twice",
      text:
        completedToday === 0
          ? "Nothing done yet — one 2-min action now."
          : "Slip-ups are fine. Return tomorrow.",
      tag: "Mindset",
    });

    return tipsList;
  }, [habits]);

  return (
    <div className="h-full min-h-65 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-5 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--accent-color)" }}
          />
          <h3 className="font-serif text-base font-semibold text-[var(--text-main)] sm:text-lg">
            Smart Insights
          </h3>
        </div>
        <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:bg-[#27231F]">
          Live
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {dynamicTips.map((tip) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={tip.id}
              className="flex items-start gap-2.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--bg-subtle)]/60 px-2.5 py-2.5 transition-colors dark:border-[#2F2A25]/70 dark:bg-[#27231F]/60"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--border-color)]/70 text-[var(--text-main)] dark:bg-[#3A322A]">
                <IconComponent className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate font-serif text-sm font-medium text-[var(--text-main)]">
                    {tip.title}
                  </h4>
                  <span
                    className="shrink-0 text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {tip.tag}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--text-muted)]">
                  {tip.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}