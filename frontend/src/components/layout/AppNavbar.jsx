import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { APP_NAV_LINKS } from "./navLinks";
import ProfileMenu from "./ProfileMenu";
import MobileNavDrawer from "./MobileNavDrawer";
import { toast } from "../../context/ToastContext";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/80 text-[var(--text-main)] shadow-[0_8px_30px_rgba(44,38,31,0.06)] backdrop-blur-xl transition-all duration-300 dark:border-[#2F2A25]/90 dark:bg-[#1E1B18]/85 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-7">
        <Link
          to="/dashboard"
          className="shrink-0 font-serif text-2xl tracking-tight text-[var(--text-main)] transition-opacity hover:opacity-75"
        >
          HabitFlow
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-base font-medium tracking-wide lg:flex xl:gap-8 xl:text-lg"
        >
          {APP_NAV_LINKS.filter(({ to }) => to !== "/settings").map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative whitespace-nowrap py-1.5 transition-colors focus-visible:outline-none ${
                  isActive
                    ? "font-semibold text-[var(--text-main)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    style={{ backgroundColor: "var(--accent-color)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ProfileMenu
            user={user}
            open={isProfileOpen}
            onToggle={() => setIsProfileOpen((v) => !v)}
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-main)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] lg:hidden"
            onClick={() => {
              setIsMenuOpen((v) => !v);
              setIsProfileOpen(false);
            }}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                isMenuOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                isMenuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>

      <MobileNavDrawer
        open={isMenuOpen}
        user={user}
        onNavigate={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}