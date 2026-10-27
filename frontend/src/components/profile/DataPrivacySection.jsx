import { useState } from "react";
import { Download, Shield, Trash2, UserX } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import ProfileSection from "./ProfileSection";
import { PROFILE_SECONDARY_BUTTON_CLASS } from "./profileStyles";
import { toast } from "../../context/ToastContext";

export default function DataPrivacySection({
  onExport,
  deleteHabitData,
  deleteAccount,
  fetchHabits,
  navigate,
  onNotify,
  loading,
}) {
  const [confirmAction, setConfirmAction] = useState(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!confirmAction || busy) return;
    setBusy(true);
    const action = confirmAction;
    const result = action === "habits" ? await deleteHabitData() : await deleteAccount();
    setBusy(false);
    setConfirmAction(null);

    if (!result.success) {
      const err = result.error || "The action could not be completed.";
      onNotify?.(err, "error");
      toast.error(err);
      return;
    }
    if (action === "habits") {
      await fetchHabits();
      const msg = result.message || "All habit data was deleted. Your account remains active.";
      onNotify?.(msg);
      return;
    }
    toast.success("Your account has been permanently deleted.");
    navigate("/", { replace: true });
  };

  const dialog = confirmAction === "habits"
    ? {
        title: "Delete all habit data?",
        message: "This permanently removes every habit and completion record from your account. Your account and profile will remain. This cannot be undone.",
        confirmLabel: "Delete all habit data",
      }
    : {
        title: "Permanently delete your account?",
        message: "This permanently deletes your account and all associated habits and completion history. You will be signed out, and this cannot be undone.",
        confirmLabel: "Delete account permanently",
      };

  return (
    <>
      <ProfileSection
        icon={Shield}
        title="Data & privacy"
        description="Export a copy of your data or permanently remove it from HabitFlow."
        className="border-red-900/15 dark:border-red-950/70"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/55 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#2F2A25] dark:bg-[#27231F]/55">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-main)]">Export your data</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Download your profile and habit history as a JSON backup.</p>
            </div>
            <button type="button" onClick={onExport} disabled={loading} className={`${PROFILE_SECONDARY_BUTTON_CLASS} shrink-0`}>
              <Download size={16} aria-hidden="true" />
              Export JSON
            </button>
          </div>

          <div className="rounded-2xl border border-amber-700/25 bg-amber-500/[0.04] p-4 dark:border-amber-900/60 dark:bg-amber-950/15">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-main)]">Delete all habit data</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Remove habits and completion history while keeping your account.</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmAction("habits")}
                disabled={loading || busy}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-700/30 px-3.5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-500/10 disabled:opacity-50 dark:text-amber-200"
              >
                <Trash2 size={16} aria-hidden="true" />
                Clear habit data
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-red-800/25 bg-red-500/[0.035] p-4 dark:border-red-950/80 dark:bg-red-950/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-main)]">Delete account permanently</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Delete your account and all associated information.</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmAction("account")}
                disabled={loading || busy}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-800 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-900 disabled:opacity-50 dark:bg-red-950 dark:hover:bg-red-900"
              >
                <UserX size={16} aria-hidden="true" />
                Delete account
              </button>
            </div>
          </div>
        </div>
      </ProfileSection>
      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={dialog.title}
        message={dialog.message}
        confirmLabel={dialog.confirmLabel}
        busy={busy}
        onCancel={() => setConfirmAction(null)}
        onConfirm={confirm}
      />
    </>
  );
}
