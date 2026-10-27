import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import HabitCard from "../components/dashboard/HabitCard";
import EditHabitModal from "../components/dashboard/EditHabitModal";
import ConsistencyTrend from "../components/dashboard/ConsistencyTrend";
import TimeDistribution from "../components/dashboard/TimeDistribution";
import Toast from "../components/ui/Toast";
import useHabit from "../hooks/useHabit";
import Pageskeleton from "../components/ui/Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Dashboard() {
  const { habits, loading, updateHabit, deleteHabit, toggleHabit } = useHabit();
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const totalCount = habits.length;
  const doneCount = habits.filter((habit) => habit.status === "Completed").length;
  const pendingCount = totalCount - doneCount;

  const dailyCount = habits.filter((habit) => habit.frequency === "Every day").length;
  const scheduledCount = totalCount - dailyCount;

  const bestStreak =
    totalCount > 0
      ? Math.max(0, ...habits.map((h) => Number(h.best) || Number(h.streak) || 0))
      : 0;

  const currentStreak =
    totalCount > 0
      ? Math.max(0, ...habits.map((h) => Number(h.current) || Number(h.streak) || 0))
      : 0;

  const dynamicStats = [
    {
      title: "HABITS TRACKED",
      value: String(totalCount),
      sub: `${dailyCount} daily, ${scheduledCount} scheduled`,
    },
    {
      title: "COMPLETED TODAY",
      value: `${doneCount} / ${totalCount}`,
      sub: `${pendingCount} to go`,
    },
    {
      title: "BEST STREAK",
      value: `${bestStreak} ${bestStreak === 1 ? "day" : "days"}`,
      sub: bestStreak > 0 ? "personal record 🏆" : "start your streak",
    },
    {
      title: "CURRENT STREAK",
      value: `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`,
      sub: currentStreak > 0 ? "keep it alive 🔥" : "complete today's habits",
    },
  ];

  const displayedHabits = habits.map((habit) => ({
    ...habit,
    name: habit.title ?? habit.name,
  }));
  const editingHabit = habits.find((habit) => habit.id === editingHabitId);

  const toggle = (id) => {
    toggleHabit(id);
  };

  const saveHabit = (updatedHabit) => {
    updateHabit({
      ...editingHabit,
      ...updatedHabit,
      id: editingHabit.id,
      title: updatedHabit.title,
      name: updatedHabit.title,
      category: updatedHabit.category,
      frequency: updatedHabit.frequency,
      color: updatedHabit.color,
      iconName: updatedHabit.iconName,
      goal: updatedHabit.goal,
      reminderTime: updatedHabit.reminderTime,
      notes: updatedHabit.notes,
      note: updatedHabit.notes || updatedHabit.note,
    });
    setEditingHabitId(null);
    setToastMessage(`${updatedHabit.title} edited successfully.`);
  };

  const requestHabitDeletion = (id) => {
    setToastMessage("");
    setHabitToDelete(displayedHabits.find((habit) => habit.id === id) ?? null);
  };

  const confirmHabitDeletion = () => {
    if (!habitToDelete) return;
    deleteHabit(habitToDelete.id);
    setHabitToDelete(null);
    setToastMessage(`${habitToDelete.title ?? habitToDelete.name} deleted.`);
  };

  if (loading) return <Pageskeleton />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-36 text-[var(--text-main)] sm:px-6 lg:px-8 lg:pt-28">
      {/* Editorial Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-2xl">
          <motion.p
            variants={fadeUpVariants}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            {todayDate}
          </motion.p>
          <motion.h1
            variants={fadeUpVariants}
            className="mt-3 font-serif text-5xl tracking-tight text-[var(--text-main)] md:text-6xl lg:text-7xl"
          >
            Good {greeting}.
          </motion.h1>
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 text-lg font-medium text-[var(--text-muted)]"
          >
            You have{" "}
            <span className="font-serif text-[var(--text-main)]">
              {pendingCount} {pendingCount === 1 ? "ritual" : "rituals"}
            </span>{" "}
            remaining today. Let's make them count.
          </motion.p>
        </div>

        
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        {/* Daily Snapshot */}
        <motion.div variants={fadeUpVariants} className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Daily Snapshot
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {dynamicStats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                sub={stat.sub}
              />
            ))}
          </div>
        </motion.div>

        {/* Row 1: Consistency Trend + Time Distribution */}
        <motion.div
          variants={fadeUpVariants}
          className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch"
        >
          {/* LEFT — Consistency Trend */}
          <div className="h-[360px]">
            <ConsistencyTrend />
          </div>

          {/* RIGHT — Time Distribution */}
          <div className="h-[360px]">
            <TimeDistribution habits={displayedHabits} />
          </div>
        </motion.div>

        {/* Row 2: Today's Focus (Shifted below Consistency Trend & Time Distribution) */}
        <motion.div variants={fadeUpVariants} className="mb-10">
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-colors duration-300 sm:p-6 lg:p-7 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
            {/* Header */}
            <div className="mb-6 flex shrink-0 items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[var(--text-main)] sm:text-3xl">
                  Today&apos;s Focus
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {displayedHabits.length === 0
                    ? "No rituals yet."
                    : `${doneCount} of ${totalCount} complete today`}
                </p>
              </div>

              <Link
                to="/habits"
                className="shrink-0 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[#8C7465]/40 hover:text-[var(--text-main)] dark:border-[#2F2A25] dark:bg-[#27231F]"
              >
                Manage all rituals →
              </Link>
            </div>

            {/* Habit Cards Grid */}
            {displayedHabits.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
                {displayedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    done={habit.status === "Completed"}
                    onToggle={() => toggle(habit.id)}
                    onEdit={() => setEditingHabitId(habit.id)}
                    onDelete={() => requestHabitDeletion(habit.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-subtle)]/50 px-6 py-12 text-center dark:border-[#2F2A25] dark:bg-[#27231F]/50">
                <p className="font-serif text-xl text-[var(--text-main)]">A blank slate.</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Click “Add ritual” to begin crafting your day.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <EditHabitModal
        habit={editingHabit}
        onClose={() => setEditingHabitId(null)}
        onSave={saveHabit}
      />

      <Toast
        message={
          habitToDelete
            ? `Delete "${habitToDelete.name}"? This cannot be undone.`
            : toastMessage
        }
        type={habitToDelete ? "error" : "success"}
        visible={Boolean(habitToDelete || toastMessage)}
        actionLabel={habitToDelete ? "OK" : undefined}
        onAction={habitToDelete ? confirmHabitDeletion : undefined}
        cancelLabel={habitToDelete ? "Cancel" : undefined}
        onCancel={habitToDelete ? () => setHabitToDelete(null) : undefined}
      />
    </div>
  );
}