import { Activity, Flame, Layers } from "lucide-react";
import Card from "../ui/Card";

const cards = [
  {
    title: "Total Habits",
    icon: Layers,
    value: (habits) => habits.length,
    detail: (habits) =>
      `${habits.filter((habit) => habit.frequency === "Every day").length} daily, ${
        habits.filter((habit) => habit.frequency !== "Every day").length
      } scheduled`,
    tone: "stone",
  },
  {
    title: "Completion Rate",
    icon: Activity,
    value: (habits) =>
      `${Math.round(
        habits.reduce((total, habit) => total + (Number(habit.thisWeek) || 0), 0) /
          Math.max(habits.length, 1)
      )}%`,
    detail: () => "Avg across tracked habits",
    tone: "rust",
  },
  {
    title: "Longest Streak",
    icon: Flame,
    value: (habits) => {
      const best =
        habits.length > 0
          ? Math.max(0, ...habits.map((habit) => Number(habit.best) || 0))
          : 0;
      return `${best} ${best === 1 ? "day" : "days"}`;
    },
    detail: () => "Keep it going!",
    tone: "espresso",
  },
];

const iconTones = {
  stone:
    "bg-[var(--bg-subtle)] text-[#6F655C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  rust:
    "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]",
  espresso:
    "bg-[#2C261F] text-[#F4F0EA] dark:bg-[#27231F] dark:text-[#F4F0EA]",
};

export default function HabitSummaryCards({ habits }) {
  return (
    <section
      aria-label="Habit summary"
      className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3"
    >
      {cards.map(({ title, icon: Icon, value, detail, tone }, index) => {
        const isLastOddOnMobile = index === cards.length - 1;

        return (
          <Card
            key={title}
            className={`min-h-28 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition hover:shadow-md sm:p-5 dark:border-[#2F2A25] dark:bg-[#1E1B18] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] ${
              isLastOddOnMobile ? "col-span-2 xl:col-span-1" : ""
            }`}
          >
            <span
              className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${iconTones[tone]}`}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                {title}
              </p>
              <p className="mt-1 font-serif text-2xl font-semibold text-[var(--text-main)] sm:text-3xl">
                {value(habits)}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                {detail(habits)}
              </p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}