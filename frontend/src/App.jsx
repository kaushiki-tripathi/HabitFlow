import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Lenis from "lenis";
import AppNavbar from "./components/layout/AppNavbar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Monthly from "./pages/Monthly";
import Weekly from "./pages/Weekly";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Landing from "./pages/LandingPage";
import CustomCursor from "./components/ui/CustomCursor";
import ScrollToTop from "./components/ui/ScrollToTop";
import { HabitProvider } from "./context/HabitContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginModal from "./components/auth/LoginModal";
import SignupModal from "./components/auth/SignupModal";

// path → section id (must match DOM ids)
const LANDING_SECTIONS = {
  "/": "home",
  "/home": "home",
  "/features": "features",
  "/insights": "insights",
  "/scheduleview": "schedule",
  "/contact": "contact",
};

function getSectionId(pathname, hash) {
  if (hash && hash.length > 1) return hash.slice(1);
  return LANDING_SECTIONS[pathname] ?? null;
}

function scrollToId(id, { instant = false } = {}) {
  if (!id) return;

  const target =
    document.getElementById(id) ||
    (id === "schedule" ? document.getElementById("scheduleview") : null);

  if (!target) return;

  const offset = -100;
  const duration = instant ? 0 : 1.6;

  if (window.lenis) {
    window.lenis.scrollTo(target, {
      offset,
      duration,
      immediate: instant,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: instant ? "auto" : "smooth" });
  }
}

function AuthModals() {
  const { loginModalOpen, signupModalOpen, closeAuthModals, openLogin, openSignup } = useAuth();
  return (
    <>
      <LoginModal
        open={loginModalOpen}
        onClose={closeAuthModals}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        open={signupModalOpen}
        onClose={closeAuthModals}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1,
    });

    window.lenis = lenis;

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    const hash = location.hash || "";

    const isLanding = pathname in LANDING_SECTIONS;
    if (!isLanding) return;

    // If the page was refreshed/reloaded while on a landing subroute (e.g. /contact), redirect to "/"
    const navEntries = window.performance?.getEntriesByType?.("navigation");
    const isReload =
      navEntries?.[0]?.type === "reload" ||
      window.performance?.navigation?.type === 1;

    if (isReload && pathname !== "/") {
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    const id = getSectionId(pathname, hash);

    const smooth = sessionStorage.getItem("hf-smooth-scroll") === "1";
    if (smooth) sessionStorage.removeItem("hf-smooth-scroll");

    const timer = window.setTimeout(() => {
      scrollToId(id, { instant: !smooth });
    }, smooth ? 50 : 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, navigate]);

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <HabitProvider>
              <Routes>
                {/* Public Landing Pages */}
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/features" element={<Landing />} />
                <Route path="/insights" element={<Landing />} />
                <Route path="/scheduleview" element={<Landing />} />
                <Route path="/contact" element={<Landing />} />

                {/* Redirect legacy /login and /signup routes to home */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />

                {/* Protected App Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="flex min-h-screen flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
                        <AppNavbar />
                        <main className="flex-1">
                          <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="habits" element={<Habits />} />
                            <Route path="weekly" element={<Weekly />} />
                            <Route path="monthly" element={<Monthly />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                            <Route
                              path="*"
                              element={<Navigate to="/dashboard" replace />}
                            />
                          </Routes>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <AuthModals />
            </HabitProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}