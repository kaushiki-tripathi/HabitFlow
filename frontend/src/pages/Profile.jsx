import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, ListChecks, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Toast from "../components/ui/Toast";
import DataPrivacySection from "../components/profile/DataPrivacySection";
import IdentitySection from "../components/profile/IdentitySection";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import SecuritySection from "../components/profile/SecuritySection";
import { useAuth } from "../context/AuthContext";
import useHabit from "../hooks/useHabit";

const enter = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    updateProfile,
    updatePassword,
    deleteHabitData,
    deleteAccount,
  } = useAuth();
  const { habits, fetchHabits } = useHabit();
  const [toast, setToast] = useState({ message: "", type: "success" });
  const isGoogleUser = user?.authProvider === "google";
  const completedToday = habits.filter((habit) => habit.status === "Completed").length;

  const notify = (message, type = "success") => setToast({ message, type });

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: {
        name: user?.name || "",
        email: user?.email || "",
        about: user?.about || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        country: user?.country || "",
        authProvider: user?.authProvider || "local",
        createdAt: user?.createdAt || null,
      },
      habits: habits.map((habit) => ({
        id: habit.id || habit._id,
        title: habit.title ?? habit.name ?? "Untitled",
        category: habit.category || "",
        frequency: habit.frequency || "",
        duration: habit.duration || "",
        goal: habit.goal || "",
        status: habit.status || "",
        completedDates: habit.completedDates || [],
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `habitflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify("Your profile and habit data were exported.");
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-36 text-[var(--text-main)] sm:px-6 lg:px-8 lg:pt-28">
      <motion.div initial="hidden" animate="show" className="space-y-6">
        <motion.header variants={enter} className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Account center</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[var(--text-main)] sm:text-5xl">Your profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Manage your identity, account security, and personal habit data.
            </p>
          </div>
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] dark:border-[#2F2A25] dark:bg-[#1E1B18] sm:self-auto">
            <ShieldStatusIcon />
            {isGoogleUser ? "Google protected" : "Account protected"}
          </p>
        </motion.header>

        <motion.section variants={enter} aria-label="Account overview" className="grid gap-3 sm:grid-cols-3">
          <OverviewStat icon={UserRound} label="Habits tracked" value={habits.length} />
          <OverviewStat icon={CheckCircle2} label="Completed today" value={`${completedToday} / ${habits.length}`} />
          <OverviewStat icon={CalendarDays} label="Member since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" }) : "—"} />
        </motion.section>

        <motion.div variants={enter}>
          <IdentitySection user={user} updateProfile={updateProfile} loading={loading} onNotify={notify} />
        </motion.div>

        <section className="grid items-stretch gap-6 lg:grid-cols-2" aria-label="Profile settings">
          <motion.div variants={enter}>
            <PersonalInfoSection user={user} updateProfile={updateProfile} loading={loading} onNotify={notify} />
          </motion.div>
          <motion.div variants={enter}>
            <SecuritySection isGoogleUser={isGoogleUser} updatePassword={updatePassword} loading={loading} onNotify={notify} />
          </motion.div>
        </section>

        <motion.div variants={enter}>
          <DataPrivacySection
            onExport={exportData}
            deleteHabitData={deleteHabitData}
            deleteAccount={deleteAccount}
            fetchHabits={fetchHabits}
            navigate={navigate}
            onNotify={notify}
            loading={loading}
          />
        </motion.div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} visible={Boolean(toast.message)} />
    </main>
  );
}

function OverviewStat({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors duration-300 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--accent-color)]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="truncate font-serif text-lg font-semibold text-[var(--text-main)]">{value}</p>
      </div>
    </Card>
  );
}

function ShieldStatusIcon() {
  return <ListChecks size={15} aria-hidden="true" />;
}
