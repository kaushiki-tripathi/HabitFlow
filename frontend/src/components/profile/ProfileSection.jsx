import Card from "../ui/Card";

export default function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <Card
      className={`rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-colors duration-300 dark:border-[#2F2A25] dark:bg-[#1E1B18] sm:p-6 ${className}`}
    >
      <header className="mb-5 flex items-start gap-3 border-b border-[var(--border-color)] pb-4 dark:border-[#2F2A25]">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--accent-color)]">
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-serif text-xl font-semibold text-[var(--text-main)]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      </header>
      {children}
    </Card>
  );
}
