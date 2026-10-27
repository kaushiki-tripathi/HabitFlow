import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import WaveTransition, { WaveTransitionWhite } from "../components/ui/WaveTransition";
import Features from "../components/layout/Features";
import Insights from "../components/layout/Insights";
import Schedule from "../components/layout/Schedule";
import Contact from "../components/layout/Contact";
import Footer from "../components/layout/Footer"; 
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Word-by-word reveal (award-site style)
function AnimatedWords({ text, className = "" }) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
        delayChildren: 0.15,
      },
    },
  };

  const wordAnim = {
    hidden: {
      opacity: 0,
      y: 28,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // smooth luxury easing
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-1 ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
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

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const navEntries = window.performance?.getEntriesByType?.("navigation");
    const isReload =
      navEntries?.[0]?.type === "reload" ||
      window.performance?.navigation?.type === 1;

    if (isReload) return;

    const sectionByRoute = {
      home: "home",
      features: "features",
      insights: "insights",
      "scheduleview": "schedule",
      contact: "contact",
    };
    const route = location.pathname.slice(1);
    const sectionId = sectionByRoute[route];

    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className="scroll-smooth">

      <Navbar />

      {/* HERO */}
      <Hero/>
      <WaveTransition />

      <Features />
      <WaveTransitionWhite/>

      {/* INSIGHTS PREVIEW */}
      <Insights/>
      <WaveTransition />

      {/* SCHEDULE PREVIEW */}
      <Schedule/>
      <WaveTransitionWhite/>

      {/* CTA */}
      <Contact/>
      <WaveTransition />

      {/* FOOTER */}
      <Footer/>

    </div>
  );
}