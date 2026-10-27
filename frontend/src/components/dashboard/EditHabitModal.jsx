import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Check,
  Clock3,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
  Palette,
  Sparkles,
  Target,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Health",
  "Fitness",
  "Study",
  "Self-care",
  "Mindfulness",
  "Personal",
  "Work",
];
const FREQUENCIES = ["Every day", "Weekdays", "Weekends", "Custom"];
const ICON_OPTIONS = [
  { label: "Water", Icon: Droplets },
  { label: "Walk", Icon: Footprints },
  { label: "Read", Icon: BookOpen },
  { label: "Study", Icon: Brain },
  { label: "Self-care", Icon: Sparkles },
  { label: "Sleep", Icon: Moon },
  { label: "Exercise", Icon: Dumbbell },
  { label: "Goal", Icon: Target },
];

/* Desaturated warm accents only */
const ACCENT_COLORS = [
  { name: "Espresso", value: "indigo", color: "#2C261F" },
  { name: "Rust", value: "pink", color: "#8C7465" },
  { name: "Clay", value: "amber", color: "#A08F7E" },
  { name: "Stone", value: "green", color: "#6F655C" },
  { name: "Taupe", value: "blue", color: "#8A7B6C" },
  { name: "Mink", value: "purple", color: "#5C5046" },
];

const fieldClass =
  "w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF]/60 px-3.5 py-3 text-sm text-[#2C261F] outline-none transition placeholder:text-[#A08F7E] focus:border-[#C4B2A0] focus:bg-white focus:ring-2 focus:ring-[#C4B2A0]/20 dark:border-[#3A322A] dark:bg-[#27231F] dark:text-[#F4F0EA] dark:placeholder:text-[#8A7B6C] dark:focus:border-[#8C7465] dark:focus:bg-[#1E1B18]";

export default function EditHabitModal({
  habit,
  onClose,
  onSave,
  mode = "edit",
  open = true,
}) {
  const isAdding = mode === "add";
  const isOpen = isAdding ? open : Boolean(habit);
  const [form, setForm] = useState(() => createForm(habit));

  useEffect(() => {
    setForm(createForm(habit));
  }, [habit, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.lenis?.stop();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.lenis?.start();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    onSave({ ...(habit ?? {}), ...form, title });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="habit-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#2C261F]/30 p-4 backdrop-blur-sm dark:bg-black/65"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-habit-title"
            data-lenis-prevent
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-[1.75rem] border border-[#E8DFD6] bg-[#FFFCFA] p-5 shadow-[0_24px_80px_rgba(44,38,31,0.18)] dark:border-[#2F2A25] dark:bg-[#1E1B18] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:p-7"
          >
        <header className="mb-5 flex items-center justify-between">
          <h2
            id="edit-habit-title"
            className="font-serif text-2xl tracking-tight text-[#2C261F] dark:text-[#F4F0EA]"
          >
            {isAdding ? "Add habit" : "Edit habit"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit habit dialog"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E8DFD6] text-[#6F655C] transition hover:bg-[#F1EAE2] hover:text-[#2C261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] dark:border-[#3A322A] dark:text-[#A08F7E] dark:hover:bg-[#27231F] dark:hover:text-[#F4F0EA]"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
              Habit name
            </span>
            <input
              autoFocus
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={fieldClass}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
                Category
              </span>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className={fieldClass}
              >
                {!CATEGORIES.includes(form.category) && (
                  <option>{form.category}</option>
                )}
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
                Frequency
              </span>
              <select
                value={form.frequency}
                onChange={(event) => updateField("frequency", event.target.value)}
                className={fieldClass}
              >
                {!FREQUENCIES.includes(form.frequency) && (
                  <option>{form.frequency}</option>
                )}
                {FREQUENCIES.map((frequency) => (
                  <option key={frequency}>{frequency}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
              Icon
            </legend>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(({ label, Icon }) => {
                const selected = form.iconName === label;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-label={`${label} icon`}
                    aria-pressed={selected}
                    onClick={() => updateField("iconName", label)}
                    className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] ${
                      selected
                        ? "border-[#8C7465] bg-[#F1EAE2] text-[#8C7465] ring-1 ring-[#8C7465]/25 dark:border-[#8C7465] dark:bg-[#3A322A] dark:text-[#D4C4B0]"
                        : "border-[#E8DFD6] bg-white text-[#8A7B6C] hover:bg-[#F7F4EF] dark:border-[#3A322A] dark:bg-[#27231F] dark:text-[#A08F7E] dark:hover:bg-[#302A25]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
              <Palette size={13} /> Accent color
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {ACCENT_COLORS.map((color) => {
                const selected = form.color === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={`${color.name} accent color`}
                    aria-pressed={selected}
                    onClick={() => updateField("color", color.value)}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C261F] dark:focus-visible:ring-[#C4B2A0] ${
                      selected
                        ? "border-white ring-2 ring-[#8C7465] dark:border-[#1E1B18] dark:ring-[#C4B2A0]"
                        : "border-white hover:ring-2 hover:ring-[#C4B2A0] dark:border-[#1E1B18]"
                    }`}
                    style={{ backgroundColor: color.color }}
                  >
                    {selected && (
                      <Check size={15} className="text-white" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
                Goal <span className="font-normal normal-case tracking-normal text-[#A08F7E] dark:text-[#8A7B6C]">(optional)</span>
              </span>
              <input
                value={form.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                placeholder="e.g. 20 minutes"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
                Reminder time{" "}
                <span className="font-normal normal-case tracking-normal text-[#A08F7E] dark:text-[#8A7B6C]">(optional)</span>
              </span>
              <span className="relative block">
                <input
                  value={form.reminderTime}
                  onChange={(event) => updateField("reminderTime", event.target.value)}
                  className={`${fieldClass} pr-10`}
                />
                <Clock3
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A08F7E] dark:text-[#8A7B6C]"
                />
              </span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C] dark:text-[#A08F7E]">
              Notes <span className="font-normal normal-case tracking-normal text-[#A08F7E] dark:text-[#8A7B6C]">(optional)</span>
            </span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Why does this habit matter to you?"
              className={`${fieldClass} resize-y`}
            />
          </label>

          <footer className="grid gap-2 pt-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#E8DFD6] bg-white px-4 py-3 text-sm font-semibold text-[#6F655C] transition hover:bg-[#F7F4EF] hover:text-[#2C261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] dark:border-[#3A322A] dark:bg-[#27231F] dark:text-[#C4B2A0] dark:hover:bg-[#302A25] dark:hover:text-[#F4F0EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#2C261F] px-4 py-3 text-sm font-semibold text-[#F7F4EF] transition hover:bg-[#3A322A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C261F] focus-visible:ring-offset-2 dark:bg-[#3A322A] dark:text-[#F4F0EA] dark:hover:bg-[#4A4038] dark:focus-visible:ring-[#C4B2A0] dark:focus-visible:ring-offset-[#1E1B18]"
            >
              {isAdding ? "Add Habit" : "Save Habit"}
            </button>
          </footer>
        </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function createForm(habit) {
  if (!habit) {
    return {
      title: "",
      category: "Health",
      frequency: "Every day",
      iconName: "Water",
      color: "green",
      goal: "",
      reminderTime: "",
      notes: "",
    };
  }

  const title = habit.title ?? habit.name ?? "";
  const iconName =
    habit.iconName ??
    ICON_OPTIONS.find(({ label }) =>
      (title === "Drink Water" && label === "Water") ||
      (title === "Morning Walk" && label === "Walk") ||
      (title === "Read 10 Pages" && label === "Read") ||
      (title === "Study Session" && label === "Study") ||
      (title === "Skincare Routine" && label === "Self-care") ||
      (title === "No Phone Before Bed" && label === "Sleep")
    )?.label ??
    "Goal";

  return {
    title,
    category: habit.category ?? "Personal",
    frequency: habit.frequency ?? "Every day",
    iconName,
    color: habit.color ?? "green",
    goal: habit.goal ?? "",
    reminderTime: habit.reminderTime ?? "",
    notes: habit.notes ?? habit.note ?? "",
  };
}