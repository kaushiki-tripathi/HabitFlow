import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const easeLuxury = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeLuxury },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const FOOTER_LINKS = {
  product: [
    { label: "Home", to: "/home", id: "home" },
    { label: "Features", to: "/features", id: "features" },
    { label: "Insights", to: "/insights", id: "insights" },
    { label: "Schedule", to: "/scheduleview", id: "schedule" },
  ],
  app: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Habits", to: "/habits" },
    { label: "Weekly", to: "/weekly" },
    { label: "Monthly", to: "/monthly" },
  ],
};

function smoothScrollToId(id) {
  const target =
    document.getElementById(id) ||
    (id === "schedule" ? document.getElementById("scheduleview") : null);

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

export default function Footer() {
  const year = new Date().getFullYear();
  const { isAuthenticated, openLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAppLinkClick = (e, to) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(to);
    } else {
      openLogin();
    }
  };

  const handleProductClick = (e, link) => {
    e.preventDefault();

    // same flag Navbar uses so App.jsx can smooth-scroll after route change
    sessionStorage.setItem("hf-smooth-scroll", "1");

    const onLanding =
      location.pathname === "/" ||
      FOOTER_LINKS.product.some((l) => l.to === location.pathname) ||
      location.pathname === "/contact";

    if (onLanding) {
      smoothScrollToId(link.id);
      if (location.pathname !== link.to) {
        navigate(link.to, { replace: true });
      }
      return;
    }

    // coming from app pages → go to landing section route
    navigate(link.to);
  };

  return (
    <footer
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#2C261F] text-[#F7F4EF]"
    >
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-20 sm:px-8 lg:pt-24">
        {/* Top CTA band */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 lg:mb-20 lg:flex-row lg:items-end lg:pb-20"
        >
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C4B2A0]">
              Begin quietly
            </p>
            <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Ready to keep the promises
              <br className="hidden sm:block" /> you make to yourself?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleAppLinkClick(e, "/dashboard")}
              className="inline-flex items-center gap-2 rounded-full bg-[#F7F4EF] px-6 py-3.5 text-sm font-semibold text-[#2C261F] transition-transform duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              Open App
              <ArrowUpRight size={16} strokeWidth={2} />
            </button>
            <a
              href="mailto:kaushikitripathi07@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F7F4EF] backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/10 active:scale-95"
            >
              <Mail size={16} strokeWidth={1.75} />
              Contact
            </a>
          </div>
        </motion.div>

        {/* Link columns */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              onClick={(e) =>
                handleProductClick(e, { to: "/home", id: "home" })
              }
              className="font-serif text-2xl tracking-tight text-[#F7F4EF] transition-colors hover:text-white"
            >
              HabitFlow
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#A89A8C]">
              A calm space for daily routines. Track, reflect, and grow —
              without noise or pressure.
            </p>
          </motion.div>

          {/* Product — Lenis smooth scroll */}
          <motion.div variants={fadeUp}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B2A0]">
              Explore
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.to}>
                  <button
                    type="button"
                    onClick={(e) => handleProductClick(e, link)}
                    className="text-sm text-[#D8CFC4] transition-colors duration-300 hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* App */}
          <motion.div variants={fadeUp}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B2A0]">
              App
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.app.map((link) => (
                <li key={link.to}>
                  <button
                    type="button"
                    onClick={(e) => handleAppLinkClick(e, link.to)}
                    className="text-sm text-[#D8CFC4] transition-colors duration-300 hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact blurb */}
          <motion.div variants={fadeUp} className="col-span-2 sm:col-span-1">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B2A0]">
              Contact
            </p>
            <p className="text-sm leading-relaxed text-[#A89A8C]">
              Questions, feedback, or ideas for HabitFlow.
            </p>
            <a
              href="mailto:kaushikitripathi07@gmail.com"
              className="mt-3 inline-block text-sm font-medium text-[#F7F4EF] underline decoration-[#8C7465]/60 underline-offset-4 transition hover:decoration-[#F7F4EF]"
            >
              kaushikitripathi07@gmail.com
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row"
        >
          <p className="text-xs text-[#8A7B6C]">
            © {year} HabitFlow · Built by Kaushiki
          </p>
          <p className="text-xs tracking-wide text-[#8A7B6C]">
            Built daily, not suddenly.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}