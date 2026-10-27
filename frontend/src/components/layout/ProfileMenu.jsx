import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function ProfileMenu({
  user,
  open,
  onToggle,
  onClose,
  onLogout,
}) {
  const ref = useRef(null);
  const name = user?.name || "User";
  const email = user?.email || "";
  const avatar = user?.avatar || "";
  const firstName = name.trim().split(/\s+/)[0] || "User";

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) onClose?.();
    }
    function onKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)]/80 py-1 pl-1 pr-3 text-[var(--text-main)] transition-all hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] dark:bg-[#27231F]/80"
      >
        <UserAvatar name={name} avatar={avatar} size="md" />
        <span className="max-w-28 truncate text-sm font-semibold text-[var(--text-main)]">
          {firstName}
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-muted)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-full z-50 mt-3 w-64 origin-top-right rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-2 shadow-[0_20px_50px_rgba(44,38,31,0.12)] backdrop-blur-xl transition-all duration-200 dark:border-[#2F2A25] dark:bg-[#1E1B18]/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="mb-1 rounded-xl bg-[var(--bg-subtle)]/80 px-3 py-3 dark:bg-[#27231F]/80">
          <div className="flex items-center gap-3">
            <UserAvatar name={name} avatar={avatar} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                {name}
              </p>
              {email ? (
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {email}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Added Profile Link */}
        <Link
          to="/profile"
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
        >
          <UserIcon size={16} />
          Profile
        </Link>

        <Link
          to="/settings"
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
        >
          <Settings size={16} />
          Settings
        </Link>

        <button
          type="button"
          role="menuitem"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
          style={{ color: "var(--accent-color)" }}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}