import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Force manual scroll restoration so the browser never restores scroll mid-page on refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Always reset to top (0, 0) on every page refresh or route change
  useEffect(() => {
    const forceScrollTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    };

    forceScrollTop();

    // Secondary frame check to ensure Lenis and DOM render complete at top
    const rafId = requestAnimationFrame(forceScrollTop);
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname]);

  // Toggle floating button visibility after scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollToTopBtn = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleScrollToTopBtn}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DFD6] bg-[#FFFCFA]/90 text-[#2C261F] shadow-[0_8px_30px_rgba(44,38,31,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#2C261F] hover:text-[#F4F0EA] active:scale-95 dark:border-[#2F2A25] dark:bg-[#1E1B18]/90 dark:text-[#F4F0EA]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}