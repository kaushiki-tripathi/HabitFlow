import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ENTRANCE } from "../../lib/motion";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", to: "/home", id: "home" },
  { name: "Features", to: "/features", id: "features" },
  { name: "Insights", to: "/insights", id: "insights" },
  { name: "Schedule", to: "/scheduleview", id: "schedule" },
  { name: "Contact", to: "/contact", id: "contact" },
];

function smoothScrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return false;

  if (window.lenis) {
    window.lenis.scrollTo(target, {
      offset: -100,
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  return true;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  const {
    isAuthenticated,
    openLogin: authOpenLogin,
    openSignup: authOpenSignup,
  } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();

  const openLogin = () => {
    setIsMenuOpen(false);
    authOpenLogin();
  };

  const openSignup = () => {
    setIsMenuOpen(false);
    authOpenSignup();
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Navbar background threshold
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle Lenis & Body lock when mobile menu opens
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    if (window.lenis) {
      if (isMenuOpen) window.lenis.stop();
      else window.lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, [isMenuOpen]);

  // SCROLL SPY: Intersection Observer to update active navigation link dynamically
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-15% 0px -40% 0px", // Triggers when section is in the top/middle of screen
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Normalize scheduleview ID back to schedule for the nav state
          const id = entry.target.id === "scheduleview" ? "schedule" : entry.target.id;
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Small delay ensures DOM nodes exist after initial route load
    const timeoutId = setTimeout(() => {
      navLinks.forEach((link) => {
        const elId = link.id === "schedule" ? "scheduleview" : link.id;
        const el = document.getElementById(elId) || document.getElementById(link.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);

  const handleNavClick = (event, link) => {
    event.preventDefault();
    setIsMenuOpen(false);
    setActiveSection(link.id); // Immediately update UI for snappiness

    sessionStorage.setItem("hf-smooth-scroll", "1");

    const onLanding =
      location.pathname === "/" ||
      navLinks.some((l) => l.to === location.pathname);

    if (onLanding) {
      const targetId = link.id === "schedule" ? "scheduleview" : link.id;
      smoothScrollToId(targetId) || smoothScrollToId(link.id);
      
      if (location.pathname !== link.to) {
        navigate(link.to, { replace: true });
      }
      return;
    }

    navigate(link.to);
  };

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex justify-center px-3">
        <motion.header
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: ENTRANCE.duration,
            ease: ENTRANCE.ease,
            delay: ENTRANCE.delay,
          }}
          className={`pointer-events-auto w-full max-w-6xl rounded-full border transition-all duration-500 ${
            scrolled
              ? "border-[#E0D5CA]/90 bg-[#FFFCFA]/90 shadow-[0_12px_40px_rgba(44,38,31,0.10)] backdrop-blur-xl"
              : "border-[#E8DFD6]/80 bg-[#FFFCFA]/70 shadow-[0_8px_30px_rgba(44,38,31,0.06)] backdrop-blur-lg"
          }`}
        >
          <div className="mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, navLinks[0])}
              className="shrink-0 font-serif text-3xl font-semibold tracking-tight text-[#2C261F] transition-opacity hover:opacity-70 sm:text-2xl"
            >
              HabitFlow
            </Link>

            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
              {navLinks.map((link) => {
                // Determine active status manually using scroll spy or fallback to route path
                const isActive = activeSection 
                  ? activeSection === link.id 
                  : (location.pathname === link.to || (location.pathname === '/' && link.id === 'home'));

                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`group relative rounded-full px-3.5 py-2 text-lg font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] ${
                      isActive
                        ? "text-[#2C261F] font-semibold"
                        : "text-[#7A6F64] hover:text-[#2C261F]"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-[2.5px] origin-left rounded-full bg-[#2C261F] transition-transform duration-300 ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Open App / Auth */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-[#2C261F] px-5 py-2.5 text-[13px] font-semibold text-[#F7F4EF] transition-all duration-300 hover:scale-[1.03] hover:bg-[#3A322A] active:scale-95"
                >
                  Dashboard
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              ) : (
                <>
                  <button
  type="button"
  onClick={openLogin}
  className="group relative rounded-full px-4 py-2 text-md font-medium text-[#7A6F64] transition-colors duration-300 hover:text-[#2C261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0]"
>
  Log in
  <span
    className="absolute inset-x-3 -bottom-0.5 h-[2.5px] origin-left scale-x-0 rounded-full bg-[#2C261F] transition-transform duration-300 group-hover:scale-x-100"
  />
</button>
                  <button
                    type="button"
                    onClick={openSignup}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-[#2C261F] px-5 py-2.5 text-md font-semibold text-[#F7F4EF] transition-all duration-300 hover:scale-[1.03] hover:bg-[#3A322A] active:scale-95"
                  >
                    Sign Up
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#2C261F] transition-colors hover:bg-[#F1EAE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] lg:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
        </motion.header>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-[#2C261F]/25 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-[4.75rem] z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 overflow-hidden rounded-[28px] border border-[#E8DFD6] bg-[#FFFCFA]/95 p-5 shadow-[0_24px_60px_rgba(44,38,31,0.14)] backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = activeSection 
                    ? activeSection === link.id 
                    : (location.pathname === link.to || (location.pathname === '/' && link.id === 'home'));

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.04,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        to={link.to}
                        onClick={(e) => handleNavClick(e, link)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive
                            ? "bg-[#F1EAE2] text-[#2C261F]"
                            : "text-[#6F655C] hover:bg-[#F7F4EF] hover:text-[#2C261F]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Open App / Auth */}
              <div className="mt-4 flex flex-col gap-2 border-t border-[#E8DFD6] pt-4">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2C261F] py-3.5 text-base font-semibold text-[#F7F4EF] transition-transform active:scale-95"
                  >
                    Dashboard
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={openSignup}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2C261F] py-3.5 text-base font-semibold text-[#F7F4EF] transition-transform active:scale-95"
                    >
                      Open App
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={openLogin}
                      className="flex w-full items-center justify-center py-2 text-sm font-medium text-[#7A6F64] transition-colors hover:text-[#2C261F]"
                    >
                      Already have an account? Log in
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}