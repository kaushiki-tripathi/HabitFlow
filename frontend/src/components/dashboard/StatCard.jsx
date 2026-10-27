import { CalendarCheck, CheckCircle2, Flame, Layers3, TrendingUp } from "lucide-react";
import Card from "../ui/Card";

const STAT_ICONS = {
  "Habits Tracked": Layers3,
  "Completed Today": CheckCircle2,
  "Best Streak": Flame,
  "Weekly Progress": TrendingUp,
};

export default function StatCard({ title, value, sub }) {
  const Icon = STAT_ICONS[title] ?? CalendarCheck;

  return (
    <Card className="min-h-28 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-[0_8px_30px_rgba(44,38,31,0.04)] transition duration-300 hover:shadow-[0_12px_36px_rgba(44,38,31,0.08)] dark:border-[#2F2A25] dark:bg-[#1E1B18] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <span
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]"
        style={{ color: "var(--accent-color)" }}
      >
        <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {title}
      </p>
      <p className="mt-1 font-serif text-3xl tracking-tight text-[var(--text-main)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{sub}</p>
    </Card>
  );
}