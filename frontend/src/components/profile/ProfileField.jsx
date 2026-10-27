export default function ProfileField({ id, label, hint, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
