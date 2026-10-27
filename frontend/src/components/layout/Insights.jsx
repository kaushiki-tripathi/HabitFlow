import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Flame,
  ChartNoAxesColumn,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const easeLuxury = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeLuxury },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

/* Small intentional visuals — not random noise, not fake forecasts */
function HeatmapMini() {
  const cells = [
    0, 1, 0, 2, 0, 0, 3, 1, 0, 2, 0, 1,
    2, 0, 3, 1, 0, 4, 2, 0, 1, 3, 0, 2,
    0, 2, 1, 4, 3, 0, 2, 1, 3, 0, 2, 0,
    1, 0, 2, 0, 3, 4, 1, 0, 2, 1, 0, 3,
  ];
  const color = (n) =>
    ["bg-[#F1EAE2]", "bg-[#E6D7C8]", "bg-[#D4BCA6]", "bg-[#B08D73]", "bg-[#8C7465]"][n];

  return (
    <div className="grid grid-cols-12 gap-1 rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] p-3">
      {cells.map((n, i) => (
        <div key={i} className={`aspect-square rounded-[3px] ${color(n)}`} />
      ))}
    </div>
  );
}

function StreakMini() {
  return (
    <div className="flex items-end justify-between gap-4 rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-5 py-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A8776]">
          Current
        </p>
        <p className="mt-1 font-serif text-4xl tracking-tight text-[#2C261F]">12</p>
      </div>
      <div className="h-10 w-px bg-[#E8DFD6]" />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A8776]">
          Best
        </p>
        <p className="mt-1 font-serif text-4xl tracking-tight text-[#8C7465]">28</p>
      </div>
      <div className="mb-1 ml-auto flex items-end gap-1">
        {[4, 6, 5, 8, 7, 9, 10].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h * 5}px` }}
            className={`w-1.5 rounded-full ${i === 6 ? "bg-[#2C261F]" : "bg-[#D4BCA6]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function WeekMini() {
  const vals = [55, 70, 40, 85, 60, 90, 75];
  return (
    <div className="rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A8776]">
          This week
        </span>
        <span className="text-sm font-semibold text-[#2C261F]">72%</span>
      </div>
      <div className="flex h-14 items-end gap-1.5">
        {vals.map((v, i) => (
          <div key={i} className="relative flex-1 rounded-t-md bg-[#E8DFD6]">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${v}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.12 + i * 0.04, ease: easeLuxury }}
              className={`absolute bottom-0 left-0 right-0 rounded-t-md ${
                i === vals.length - 1 ? "bg-[#2C261F]" : "bg-[#8C7465]"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#A89A8E]">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={`${d}-${i}`} className="flex-1 text-center">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

const INSIGHTS = [
  {
    id: "heatmap",
    icon: CalendarDays,
    eyebrow: "Monthly insight",
    title: "Heatmaps from real completions",
    body: "Every cell is a day you actually logged. History starts at your join date — never padded, never invented.",
    visual: "heatmap",
  },
  {
    id: "streaks",
    icon: Flame,
    eyebrow: "Streak insight",
    title: "Current & best streaks, calculated live",
    body: "Streaks come from consecutive completedDates in your habit log. Miss a day and the math stays honest.",
    visual: "streak",
  },
  {
    id: "weekly",
    icon: ChartNoAxesColumn,
    eyebrow: "Weekly insight",
    title: "Monday-based weekly trends",
    body: "See how your routine held across the week. Built for reflection — a missed day is a data point, not a failure.",
    visual: "week",
  },
];

export default function Insights() {
  const navigate = useNavigate();
  const { isAuthenticated, openLogin } = useAuth();

  const handleOpen = () => {
    if (isAuthenticated) navigate("/dashboard");
    else openLogin?.();
  };

  return (
    <section
      id="insights"
      className="relative scroll-mt-24 overflow-hidden bg-[#f7e8c5] px-5 py-24 sm:px-8 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[#E8DFD4]/45 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#8A7B6C]"
          >
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl tracking-tight text-[#2C261F] sm:text-5xl lg:text-[3.25rem]"
          >
            See your consistency clearly
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#6F655C] sm:text-base"
          >
            HabitFlow turns daily check-ins into calm weekly and monthly insights —
            reconstructed from your real completion history, not vanity metrics.
          </motion.p>
        </motion.div>

        {/* Insight panels */}
        <motion.div
          className="grid gap-5 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {INSIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.id}
                variants={fadeUp}
                className="flex flex-col rounded-[28px] border border-[#E8DFD6] bg-[#FFFCFA] p-6 shadow-[0_16px_40px_rgba(44,38,31,0.05)] sm:p-7"
              >
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EAE2] text-[#8C7465]">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A8776]">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-1 font-serif text-xl tracking-tight text-[#2C261F]">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-[#6F655C]">
                  {item.body}
                </p>

                <div className="mt-auto">
                  {item.visual === "heatmap" && <HeatmapMini />}
                  {item.visual === "streak" && <StreakMini />}
                  {item.visual === "week" && <WeekMini />}
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Truth strip + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: easeLuxury }}
          className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[28px] border border-[#E8DFD6] bg-[#2C261F] px-6 py-6 sm:flex-row sm:items-center sm:px-8"
        >
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C4B2A0]">
              After you sign in
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#E8DFD6] sm:text-base">
              Dashboard totals,{" "}
              <span className="text-[#FFFCFA]">Weekly</span> reviews, and{" "}
              <span className="text-[#FFFCFA]">Monthly</span> heatmaps all read from the
              same completion log — exportable anytime from Profile.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F7F4EF] px-6 py-3.5 text-sm font-semibold text-[#2C261F] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Open insights in app
            <ArrowUpRight size={16} strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}