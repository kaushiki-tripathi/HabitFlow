import { useMemo } from "react";
import Card from "../ui/Card";

const CATEGORY_COLORS = [
  "#8C7465",
  "#2C261F",
  "#A89080",
  "#6F655C",
  "#C4B2A0",
  "#8A7B6C",
  "#D4C4B0",
];

export default function HabitInsights({ habits, onViewAll }) {
  const categories = useMemo(
    () =>
      [...new Set(habits.map((habit) => habit.category).filter(Boolean))].map(
        (category, index) => ({
          name: category,
          count: habits.filter((habit) => habit.category === category).length,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        })
      ),
    [habits]
  );

  const total = habits.length || 1;
  const gradient = categories.reduce((value, category, index) => {
    const prior =
      (categories.slice(0, index).reduce((sum, item) => sum + item.count, 0) /
        total) *
      100;
    const next = prior + (category.count / total) * 100;
    return `${value}${index ? ", " : ""}${category.color} ${prior}% ${next}%`;
  }, "");

  return (
    <Card className="h-full min-h-65 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
        <h2 className="font-serif text-base font-semibold text-[var(--text-main)] sm:text-lg">
          Habit Categories
        </h2>
        {typeof onViewAll === "function" && habits.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold transition hover:opacity-80"
            style={{ color: "var(--accent-color)" }}
          >
            View all
          </button>
        )}
      </div>

      {habits.length ? (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div
            className="relative h-24 w-24 shrink-0 rounded-full"
            style={{
              background: `conic-gradient(${gradient || "var(--border-color) 0% 100%"})`,
            }}
          >
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[var(--bg-card)] dark:bg-[#1E1B18]">
              <span className="font-serif text-base font-semibold text-[var(--text-main)]">
                {habits.length}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Habits</span>
            </div>
          </div>

          <ul className="w-full min-w-0 flex-1 space-y-2">
            {categories.map((category) => (
              <li
                key={category.name}
                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <span className="shrink-0 font-semibold text-[var(--text-main)]">
                  {category.count}{" "}
                  <span className="font-normal text-[var(--text-muted)]">
                    ({Math.round((category.count / total) * 100)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-[var(--text-muted)]">
          Add habits to see categories.
        </p>
      )}
    </Card>
  );
}