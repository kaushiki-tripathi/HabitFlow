import {
  Droplets,
  Footprints,
  BookOpen,
  Brain,
  Sparkles,
  Moon,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export function Tag({ done, tagColor, tag }) {
  const label = done ? "Completed" : tag;
  const cls = done
    ? "bg-[var(--bg-subtle)] text-[var(--text-muted)] dark:bg-[#27231F] dark:text-[#A08F7E]"
    : "bg-[var(--bg-subtle)] text-[var(--text-main)] dark:bg-[#27231F] dark:text-[#C4B2A0]";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

export function MiniMetric({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-[var(--text-main)]">{value}</p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

const TONES = {
  blue: {
    icon: "bg-[var(--bg-subtle)] text-[#6F655C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#8C7465]",
  },
  green: {
    icon: "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#8C7465]",
  },
  amber: {
    icon: "bg-[var(--bg-subtle)] text-[#8A7B6C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#A08F7E]",
  },
  purple: {
    icon: "bg-[var(--bg-subtle)] text-[#7A6F64] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#6F655C]",
  },
  pink: {
    icon: "bg-[var(--bg-subtle)] text-[#8C7465] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#8C7465]",
  },
  indigo: {
    icon: "bg-[var(--bg-subtle)] text-[#6F655C] dark:bg-[#27231F] dark:text-[#C4B2A0]",
    ring: "bg-[var(--bg-subtle)] dark:bg-[#241F1A]",
    fill: "bg-[#5C5046]",
  },
};

const ICONS = {
  "Drink Water": Droplets,
  "Morning Walk": Footprints,
  "Read 10 Pages": BookOpen,
  "Study Session": Brain,
  "Skincare Routine": Sparkles,
  "No Phone Before Bed": Moon,
};

function HabitCard({ habit, done, onToggle, onEdit, onDelete }) {
  const tone = TONES[habit.color] ?? TONES.green;
  const Icon = ICONS[habit.name] ?? Sparkles;

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-[0_8px_30px_rgba(44,38,31,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4C4B4] hover:shadow-[0_14px_40px_rgba(44,38,31,0.08)] dark:border-[#2F2A25] dark:bg-[#1E1B18] dark:hover:border-[#3A322A]">
      {/* Row 1 — icon + name + tag */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
          >
            <Icon size={17} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--text-main)]">
              {habit.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {habit.category} · {habit.frequency}
            </p>
          </div>
        </div>
        <Tag done={done} tagColor={habit.tagColor} tag={habit.tag} />
      </div>

      {/* Row 2 — Check action */}
      <div className={`mt-3 flex items-center gap-3 rounded-xl p-3 ${tone.ring}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Toggle ${habit.name}`}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            done
              ? `${tone.fill} border-transparent text-white shadow-sm`
              : "border-[var(--border-color)] bg-[var(--bg-card)] text-transparent hover:border-[#8C7465] dark:border-[#3A322A] dark:bg-[#1E1B18]"
          }`}
        >
          <Check size={14} strokeWidth={3} />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-main)]">
            {done ? "Completed today" : "Mark as done"}
          </p>
          <p className="truncate text-sm text-[var(--text-muted)]">{habit.note}</p>
        </div>
      </div>

      {/* Row 3 — metrics */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-[var(--border-color)] border-t border-[var(--border-color)] pt-3 dark:divide-[#2F2A25] dark:border-[#2F2A25]">
        <MiniMetric value={habit.current} label="Current" />
        <MiniMetric value={habit.best} label="Best" />
        <MiniMetric value={`${habit.thisWeek}%`} label="This Week" />
      </div>

      {/* Row 4 — 7-day grid */}
      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEK.map((d, i) => {
          const filled = i < Math.round((habit.thisWeek / 100) * 7);
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span
                className={`flex h-5 w-full items-center justify-center rounded text-[9px] ${
                  filled ? `${tone.fill} text-white` : "bg-[var(--bg-subtle)] text-[#C4B2A0] dark:bg-[#27231F] dark:text-[#5C5046]"
                }`}
              >
                {filled && <Check size={10} strokeWidth={3} />}
              </span>
              <span className="text-[9px] text-[var(--text-muted)]">{d}</span>
            </div>
          );
        })}
      </div>

      {/* Row 5 — actions */}
      <div className="mt-3 flex gap-4 border-t border-[var(--border-color)] pt-3 dark:border-[#2F2A25]">
        <button
          type="button"
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)]"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[#C86A5A]"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;