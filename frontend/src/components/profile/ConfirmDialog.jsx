import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171411]/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="profile-confirm-title"
        aria-describedby="profile-confirm-message"
        className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-2xl dark:border-[#3A322A] dark:bg-[#1E1B18] sm:p-6"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-300">
          <AlertTriangle size={20} aria-hidden="true" />
        </div>
        <h2
          id="profile-confirm-title"
          className="font-serif text-xl font-semibold text-[var(--text-main)]"
        >
          {title}
        </h2>
        <p
          id="profile-confirm-message"
          className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]"
        >
          {message}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-[var(--text-main)] transition hover:bg-[var(--bg-subtle)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:opacity-60 dark:bg-red-900 dark:hover:bg-red-800"
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
