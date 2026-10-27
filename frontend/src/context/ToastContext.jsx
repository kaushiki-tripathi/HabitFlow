import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

// Module-level dispatcher so `toast.success()`, `toast.error()`, `toast.info()` can be called anywhere
let toastDispatcher = null;

export const toast = {
  success: (message, duration = 3000) => {
    toastDispatcher?.({ type: "success", message, duration });
  },
  error: (message, duration = 3500) => {
    toastDispatcher?.({ type: "error", message, duration });
  },
  info: (message, duration = 3000) => {
    toastDispatcher?.({ type: "info", message, duration });
  },
};

const styles = {
  success:
    "border-[#d9ead8] bg-[#f3faf3] text-[#2a4a31] dark:border-[#2a4a31]/60 dark:bg-[#1c2e21] dark:text-[#d9ead8]",
  error:
    "border-[#f0d7d9] bg-[#fff5f4] text-[#4d2d2b] dark:border-[#5a2f2c]/60 dark:bg-[#2b1918] dark:text-[#f8d7da]",
  info:
    "border-[#eadfce] bg-[#fff9f2] text-[#4d3c2d] dark:border-[#4d3c2d]/60 dark:bg-[#26211c] dark:text-[#f1eae2]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", message, duration = 3000 }) => {
      if (!message) return;
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  useEffect(() => {
    toastDispatcher = addToast;
    return () => {
      toastDispatcher = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toast }}>
      {children}

      {/* Floating Toast Pill Container matching native Toast theme (bottom-center) */}
      <div
        aria-live="polite"
        role="status"
        className="fixed bottom-6 left-1/2 z-[99990] -translate-x-1/2 pointer-events-none flex flex-col-reverse items-center gap-2 max-w-[92vw]"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(({ id, type, message }) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => removeToast(id)}
              className={`pointer-events-auto cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold shadow-lg ring-1 ring-black/5 transition-transform active:scale-95 ${
                styles[type] ?? styles.info
              }`}
            >
              <p className="truncate max-w-[85vw] sm:max-w-md select-none">{message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast, addToast: () => {}, removeToast: () => {} };
  }
  return context;
}
