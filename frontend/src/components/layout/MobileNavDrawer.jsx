import { NavLink } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { APP_NAV_LINKS } from "./navLinks";

export default function MobileNavDrawer({
  open,
  user,
  onNavigate,
  onLogout,
}) {
  const name = user?.name || "User";
  const email = user?.email || "";
  const avatar = user?.avatar || "";

  return (
    <div
      className={`absolute left-0 top-full mt-3 w-full rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-4 shadow-[0_20px_50px_rgba(44,38,31,0.12)] backdrop-blur-xl transition-all duration-300 dark:border-[#2F2A25] dark:bg-[#1E1B18]/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] lg:hidden ${
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-4 opacity-0"
      }`}
    >
      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/70 px-3 py-3 dark:border-[#2F2A25] dark:bg-[#27231F]/70">
        <UserAvatar name={name} avatar={avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--text-main)]">{name}</p>
          {email ? (
            <p className="truncate text-xs text-[var(--text-muted)]">{email}</p>
          ) : null}
        </div>
        <User size={16} className="shrink-0 text-[var(--text-muted)]" />
      </div>

      <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
        {APP_NAV_LINKS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                isActive
                  ? "bg-[var(--bg-subtle)] font-semibold text-[var(--text-main)] dark:bg-[#27231F]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] dark:hover:bg-[#27231F]"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-3 border-t border-[var(--border-color)] pt-3 dark:border-[#2F2A25]">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C261F] px-4 py-3 text-sm font-semibold text-[#FFFCFA] transition hover:bg-[#3A322A] active:scale-[0.99] dark:bg-[#27231F] dark:text-[#F4F0EA] dark:hover:bg-[#2F2A25]"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}