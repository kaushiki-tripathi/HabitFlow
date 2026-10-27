import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Soft spring config for the trailing outer ring
  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsVisible(false);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button';

      setIsHovered(!!isInteractive);
    };

    // Reliable window leave detection across all browsers
    const handleMouseLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        setIsVisible(false);
      }
    };

    window.addEventListener('pointermove', moveCursor);
    window.addEventListener('pointerover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central Solid Dot */}
      <motion.div
        className="fixed left-0 top-0 rounded-full bg-[#231710]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 15 : 20,
          height: isHovered ? 15 : 20,
          backgroundColor: isHovered ? '#2C261F' : '#8C7465',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </div>
  );
}