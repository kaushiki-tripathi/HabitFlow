export default function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-colors duration-300 sm:p-6 dark:border-[#2F2A25] dark:bg-[#1E1B18]">
      <header className="mb-5 flex items-start gap-3 border-b border-[var(--border-color)] pb-4 dark:border-[#2F2A25]">
        {Icon && (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-subtle)] dark:bg-[#27231F]"
            style={{ color: "var(--accent-color)" }}
          >
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-semibold text-[var(--text-main)]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-1">{children}</div>
    </section>
  );
}