import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const easeLuxury = [0.16, 1, 0.3, 1];
const ENTRANCE = { duration: 1.1, ease: easeLuxury, delay: 0.05 };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTRANCE.duration, ease: ENTRANCE.ease },
  },
};

const wordAnim = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: ENTRANCE.ease },
  },
};

function AnimatedWords({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center gap-x-[0.28em] gap-y-1 ${className}`}
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.06,
        delayChildren: ENTRANCE.delay,
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordAnim}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeroSection() {
  const { isAuthenticated, openLogin } = useAuth();
  const navigate = useNavigate();

  const handleStartTracking = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      openLogin();
    }
  };

  const handleExploreFeatures = (e) => {
    e.preventDefault();
    const target = document.getElementById("features");
    if (!target) return;

    if (window.lenis) {
      window.lenis.scrollTo(target, {
        offset: -80,
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen scroll-mt-20 items-center justify-center overflow-hidden bg-[#f7e8c5] px-5 pt-32 pb-20 text-center sm:px-10 lg:pt-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#E8DFD4]/60 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#D4BCA6]/30 blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: 0.12,
          delayChildren: ENTRANCE.delay,
        }}
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8A7B6C] sm:text-xs"
        >
          Built daily, not suddenly
        </motion.p>

        <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-[#2C261F] sm:text-6xl md:text-7xl lg:text-8xl">
          <AnimatedWords text="Become the person you keep promising yourself to be" />
        </h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-[#6F655C] sm:text-lg"
        >
          Track, analyze, and stay consistent with your habits in a calm,
          distraction-free environment.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={handleStartTracking}
            className="inline-flex items-center gap-2 rounded-full bg-[#2C261F] px-8 py-4 text-sm font-semibold text-[#F7F4EF] shadow-lg shadow-[#2C261F]/10 transition-transform duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Start Tracking
            <ArrowUpRight size={16} strokeWidth={2} />
          </button>

          <a
            href="#features"
            onClick={handleExploreFeatures}
            className="rounded-full border border-[#D8C8BD] bg-white/60 px-8 py-4 text-sm font-semibold text-[#2C261F] backdrop-blur-md transition-all duration-300 hover:border-[#2C261F] hover:bg-white active:scale-95 cursor-pointer"
          >
            Explore Features
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}