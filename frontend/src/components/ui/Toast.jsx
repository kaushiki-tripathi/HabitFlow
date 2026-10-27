export default function Toast({ message, type = "info", visible, onClose, actionLabel, onAction, cancelLabel, onCancel }) {
  if (!visible || !message) return null;

  const styles = {
    success: "border-[#d9ead8] bg-[#f3faf3] text-[#2a4a31]",
    error: "border-[#f0d7d9] bg-[#fff5f4] text-[#4d2d2b]",
    info: "border-[#eadfce] bg-[#fff9f2] text-[#4d3c2d]",
  };

  const hasActions = Boolean(onAction);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border text-sm font-semibold shadow-lg ring-1 ring-black/5 ${hasActions ? "flex w-[min(92vw,28rem)] items-center justify-between gap-4 rounded-2xl px-5 py-4" : "rounded-full px-5 py-2.5"} ${styles[type] ?? styles.info}`}
      role={hasActions ? "group" : "status"}
      aria-label={hasActions ? "Confirmation" : undefined}
      aria-live={hasActions ? "assertive" : "polite"}
    >
      <p className={hasActions ? "min-w-0 flex-1" : undefined}>{message}</p>
      {hasActions && (
        <div className="flex shrink-0 items-center gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="cursor-pointer rounded-lg border border-current/20 px-3 py-2 text-xs font-bold transition hover:bg-black/5">
              {cancelLabel ?? "Cancel"}
            </button>
          )}
          <button type="button" onClick={onAction} className="cursor-pointer rounded-lg bg-garden-rose px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
            {actionLabel ?? "OK"}
          </button>
        </div>
      )}
    </div>
  );
}
