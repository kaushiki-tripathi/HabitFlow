import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

import EditHabitModal from "../components/dashboard/EditHabitModal";
import HabitFilters from "../components/habits/HabitFilters";
import HabitInsights from "../components/habits/HabitInsights";
import HabitSummaryCards from "../components/habits/HabitSummaryCards";
import HabitTable from "../components/habits/HabitTable";
import HabitTips from "../components/habits/HabitTips";
import Toast from "../components/ui/Toast";
import useHabit from "../hooks/useHabit";
import Pageskeleton from "../components/ui/Skeleton";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
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

export default function Habits() {
  const {
    habits,
    loading,
    addHabit: createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
  } = useHabit();

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingHabit, setEditingHabit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const filteredHabits = useMemo(
    () =>
      habits.filter((habit) => {
        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Not Started" && habit.status !== "Completed") ||
          habit.status === statusFilter;
        const matchesCategory =
          categoryFilter === "All" || habit.category === categoryFilter;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          `${habit.title} ${habit.category} ${habit.frequency}`
            .toLowerCase()
            .includes(query);
        return matchesStatus && matchesCategory && matchesSearch;
      }),
    [habits, statusFilter, categoryFilter, search]
  );

  const editHabit = (updated) => {
    updateHabit({
      ...editingHabit,
      ...updated,
      id: editingHabit.id,
      title: updated.title,
      name: updated.title,
      category: updated.category,
      frequency: updated.frequency,
      color: updated.color,
      iconName: updated.iconName,
      goal: updated.goal,
      reminderTime: updated.reminderTime,
      notes: updated.notes,
      note: updated.notes || updated.note || editingHabit?.note,
    });
    setEditingHabit(null);
    setToastMessage(`${updated.title} edited successfully.`);
  };

  const handleAddHabit = (newHabit) => {
    const title = newHabit.title.trim();
    createHabit({
      title,
      name: title,
      category: newHabit.category,
      frequency: newHabit.frequency,
      status: "Not Started",
      note: newHabit.notes || newHabit.goal || "Tap the circle when finished",
      duration: newHabit.goal || "Daily practice",
      goal: newHabit.goal,
      reminderTime: newHabit.reminderTime,
      notes: newHabit.notes,
      iconName: newHabit.iconName,
      color: newHabit.color,
    });
    setShowAddModal(false);
    setToastMessage(`${title} added successfully.`);
  };

  const toggleComplete = (id) => {
    toggleHabit(id);
  };

  const requestHabitDeletion = (id) => {
    setToastMessage("");
    setHabitToDelete(habits.find((habit) => habit.id === id) ?? null);
  };

  const confirmHabitDeletion = () => {
    if (!habitToDelete) return;
    deleteHabit(habitToDelete.id);
    setToastMessage(`${habitToDelete.title ?? habitToDelete.name} deleted.`);
    setHabitToDelete(null);
  };

  if (loading) return <Pageskeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-36 text-[var(--text-main)] sm:px-6 lg:px-8 lg:pt-28">
      {/* Animated Header */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <motion.div variants={fadeUpVariants}>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Library
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight text-[var(--text-main)] md:text-5xl">
            Habits
          </h1>
          <p className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-[var(--text-muted)] sm:text-base">
            Create, organize, and track all your habits in one calm space.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
        >
          <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search habits..."
              aria-label="Search habits"
              className="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] py-3 pl-10 pr-4 text-sm text-[var(--text-main)] shadow-[0_4px_20px_rgba(44,38,31,0.04)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-color)] dark:border-[#2F2A25] dark:bg-[#1E1B18] dark:shadow-none"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2C261F] px-5 py-3 text-sm font-semibold text-[#F7F4EF] shadow-[0_8px_24px_rgba(44,38,31,0.12)] transition hover:scale-[1.02] hover:bg-[#3A322A] active:scale-95 dark:bg-[#27231F] dark:text-[#F4F0EA] dark:hover:bg-[#2F2A25] dark:shadow-none"
          >
            <Plus size={16} strokeWidth={2.25} />
            Add Habit
          </button>
        </motion.div>
      </motion.header>

      {/* Main Animated Content */}
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        
        {/* Animated Summary Cards */}
        <motion.div variants={fadeUpVariants}>
          <HabitSummaryCards habits={habits} />
        </motion.div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          
          {/* Table — top on mobile, center on desktop */}
          <motion.div variants={itemVariants} className="order-1 h-full md:col-span-2 xl:order-2 xl:col-span-1">
            <HabitTable
              habits={filteredHabits}
              onEdit={setEditingHabit}
              onDelete={requestHabitDeletion}
              onToggleComplete={toggleComplete}
            />
          </motion.div>

          {/* Filters — left on desktop */}
          <motion.div variants={itemVariants} className="order-2 h-full md:col-span-1 xl:order-1 xl:col-span-1">
            <HabitFilters
              habits={habits}
              status={statusFilter}
              category={categoryFilter}
              onStatusChange={setStatusFilter}
              onCategoryChange={setCategoryFilter}
            />
          </motion.div>

          {/* Right column: Categories + Smart Tips (stacked) */}
          <motion.div variants={itemVariants} className="order-3 flex h-full flex-col gap-5 md:col-span-1 xl:order-3 xl:col-span-1">
            <HabitInsights
              habits={habits}
              onViewAll={() => {
                setStatusFilter("All");
                setCategoryFilter("All");
                setSearch("");
              }}
            />
            <HabitTips />
          </motion.div>
        </div>
      </motion.div>

      <Toast
        message={
          habitToDelete
            ? `Delete "${habitToDelete.title ?? habitToDelete.name}"? This cannot be undone.`
            : toastMessage
        }
        type={habitToDelete ? "error" : "success"}
        visible={Boolean(habitToDelete || toastMessage)}
        actionLabel={habitToDelete ? "OK" : undefined}
        onAction={habitToDelete ? confirmHabitDeletion : undefined}
        cancelLabel={habitToDelete ? "Cancel" : undefined}
        onCancel={habitToDelete ? () => setHabitToDelete(null) : undefined}
      />

      <EditHabitModal
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={editHabit}
      />
      <EditHabitModal
        habit={null}
        mode="add"
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddHabit}
      />
    </main>
  );
}