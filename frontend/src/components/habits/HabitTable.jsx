import { useState } from "react";
import {
  BookOpen,
  Brain,
  Droplets,
  Dumbbell,
  Ellipsis,
  Footprints,
  Moon,
  Pencil,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import Card from "../ui/Card";

const HABIT_ICONS = {
  "Drink Water": Droplets,
  "Morning Walk": Footprints,
  "Read 10 Pages": BookOpen,
  "Study Session": Brain,
  "Skincare Routine": Sparkles,
  "No Phone Before Bed": Moon,
};

const ICON_OPTIONS = {
  Water: Droplets,
  Walk: Footprints,
  Read: BookOpen,
  Study: Brain,
  "Self-care": Sparkles,
  Sleep: Moon,
  Exercise: Dumbbell,
  Goal: Target,
};

const CATEGORY_STYLES = {
  Health: "bg-[var(--bg-subtle)] text-[#6F655C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  Fitness: "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  Study: "bg-[var(--bg-subtle)] text-[var(--text-main)] dark:bg-[#27231F]",
  "Self-care": "bg-[var(--bg-subtle)] text-[#8A7B6C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  Mindfulness: "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  Personal: "bg-[var(--bg-subtle)] text-[#6F655C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  Work: "bg-[var(--bg-subtle)] text-[var(--text-main)] dark:bg-[#27231F]",
};

const PROGRESS_COLORS = [
  "#8C7465",
  "#2C261F",
  "#A89080",
  "#6F655C",
  "#C4B2A0",
  "#8A7B6C",
];

export default function HabitTable({
  habits,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  const [sortBy, setSortBy] = useState("name");
  const sortedHabits = [...habits].sort((left, right) => {
    if (sortBy === "progress")
      return (Number(right.thisWeek) || 0) - (Number(left.thisWeek) || 0);
    if (sortBy === "category")
      return String(left.category ?? "").localeCompare(
        String(right.category ?? "")
      );
    return String(left.title ?? left.name ?? "").localeCompare(
      String(right.title ?? right.name ?? "")
    );
  });

  return (
    <Card className="flex h-full min-h-65 min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm transition-shadow hover:shadow-md dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] px-5 py-5 dark:border-[#2F2A25] sm:px-6">
        <h2 className="font-serif text-xl font-semibold text-[var(--text-main)]">
          Your Habits
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] dark:bg-[#241F1A]">
            <tr className="text-sm font-semibold text-[var(--text-muted)]">
              <th className="w-12 px-4 py-4">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-3 py-4">Habit</th>
              <th className="px-3 py-4">Category</th>
              <th className="px-3 py-4">Frequency</th>
              <th className="px-3 py-4">Streak</th>
              <th className="px-3 py-4">Progress</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedHabits.map((habit, index) => {
              const Icon =
                ICON_OPTIONS[habit.iconName] ??
                HABIT_ICONS[habit.title] ??
                Ellipsis;
              const progress = Math.max(0, Math.min(100, habit.thisWeek));
              const ringColor =
                PROGRESS_COLORS[index % PROGRESS_COLORS.length];
              const isCompleted = habit.status === "Completed";
              const isPaused = habit.status === "Paused";

              return (
                <tr
                  key={habit.id}
                  className="border-t border-[var(--border-color)] text-sm text-[var(--text-muted)] transition hover:bg-[var(--bg-subtle)]/60 dark:border-[#2F2A25] dark:hover:bg-[#241F1A]/80"
                >
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => onToggleComplete(habit.id)}
                      aria-label={`Mark ${habit.title} ${
                        isCompleted ? "incomplete" : "complete"
                      }`}
                      className="h-4 w-4 cursor-pointer accent-[var(--accent-color)]"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex min-w-37.5 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isPaused
                            ? "bg-[var(--bg-subtle)] text-[#C4B2A0] dark:bg-[#27231F]"
                            : "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate font-semibold ${
                            isPaused
                              ? "text-[#C4B2A0]"
                              : "text-[var(--text-main)]"
                          }`}
                        >
                          {habit.title}
                        </span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">
                          {habit.duration || habit.goal || "Daily practice"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium ${
                        CATEGORY_STYLES[habit.category] ??
                        "bg-[var(--bg-subtle)] text-[var(--text-muted)] dark:bg-[#27231F]"
                      }`}
                    >
                      {habit.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {habit.frequency}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-medium text-[var(--text-main)]">
                    {habit.current}{" "}
                    <span aria-hidden="true">🔥</span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="relative flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(${ringColor} ${progress}%, var(--border-color) ${progress}% 100%)`,
                        }}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] dark:bg-[#1E1B18]" />
                      </span>
                      <span className="font-semibold text-[var(--text-main)]">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ActionButton
                        label={`Edit ${habit.title}`}
                        onClick={() => onEdit(habit)}
                      >
                        <Pencil size={16} />
                      </ActionButton>
                      <ActionButton
                        label={`Delete ${habit.title}`}
                        onClick={() => onDelete(habit.id)}
                        danger
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sortedHabits.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  No habits match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ActionButton({ label, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition ${
        danger
          ? "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[#C86A5A] dark:hover:bg-[#27231F]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] dark:hover:bg-[#27231F]"
      }`}
    >
      {children}
    </button>
  );
}