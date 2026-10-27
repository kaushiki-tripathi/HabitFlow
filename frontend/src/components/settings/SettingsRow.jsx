export default function SettingsRow({ label, description, control }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)]/70 py-3.5 last:border-b-0 dark:border-[#2F2A25]/70">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-main)]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}