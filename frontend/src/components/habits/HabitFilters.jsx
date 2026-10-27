import { Check, ListFilter, X } from "lucide-react";
import Card from "../ui/Card";

const STATUS_FILTERS = [
  { label: "All Habits", value: "All", Icon: ListFilter },
  { label: "Completed", value: "Completed", Icon: Check },
  { label: "Not Started", value: "Not Started", Icon: X },
];

export default function HabitFilters({
  habits,
  status,
  category,
  onStatusChange,
  onCategoryChange,
}) {
  const categories = [...new Set(habits.map((habit) => habit.category))];
  const countForStatus = (value) =>
    value === "All"
      ? habits.length
      : habits.filter((habit) =>
          value === "Not Started"
            ? habit.status !== "Completed"
            : habit.status === value
        ).length;

  return (
    <Card className="flex h-full min-h-65 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-shadow hover:shadow-md dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        Filters
      </p>
      <nav aria-label="Habit status filters" className="shrink-0 space-y-2">
        {STATUS_FILTERS.map(({ label, value, Icon }) => {
          const selected = status === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => onStatusChange(value)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold transition ${
                selected
                  ? "bg-[var(--bg-subtle)] text-[var(--text-main)] dark:bg-[#27231F]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] dark:hover:bg-[#241F1A]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-[var(--bg-card)] text-[var(--accent-color)] dark:bg-[#1E1B18]"
                    : "bg-[var(--bg-subtle)] text-[var(--text-muted)] dark:bg-[#241F1A]"
                }`}
                style={selected ? { color: "var(--accent-color)" } : undefined}
              >
                <Icon size={16} />
              </span>
              <span className="flex-1">{label}</span>
              <span className="rounded-full bg-[var(--bg-card)]/80 px-2 py-1 text-xs text-[var(--text-muted)] dark:bg-[#1E1B18]/80">
                {countForStatus(value)}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="my-4 border-t border-[var(--border-color)] dark:border-[#2F2A25]" />

      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Categories
        </p>
        {category !== "All" && (
          <button
            type="button"
            onClick={() => onCategoryChange("All")}
            className="cursor-pointer text-xs font-semibold transition hover:opacity-80"
            style={{ color: "var(--accent-color)" }}
          >
            Clear
          </button>
        )}
      </div>

      <nav
        aria-label="Habit category filters"
        className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1"
      >
        <CategoryButton
          label="All categories"
          count={habits.length}
          selected={category === "All"}
          onClick={() => onCategoryChange("All")}
        />
        {categories.map((item) => (
          <CategoryButton
            key={item}
            label={item}
            count={habits.filter((habit) => habit.category === item).length}
            selected={category === item}
            onClick={() => onCategoryChange(item)}
          />
        ))}
      </nav>
    </Card>
  );
}

function CategoryButton({ label, count, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
        selected
          ? "bg-[var(--bg-subtle)] font-semibold text-[var(--text-main)] dark:bg-[#27231F]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] dark:hover:bg-[#241F1A]"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full ${
          selected ? "" : "bg-[var(--border-color)] dark:bg-[#3A322A]"
        }`}
        style={selected ? { backgroundColor: "var(--accent-color)" } : undefined}
      />
      <span className="flex-1">{label}</span>
      <span className="text-xs text-[var(--text-muted)]">{count}</span>
    </button>
  );
}