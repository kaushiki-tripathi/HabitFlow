import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const SETTINGS_KEY = "habitflow.preferences.v1";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) return parsed.theme;
      }
    } catch {
      // fallback
    }
    return "Light"; // Default
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (currentTheme) => {
      let isDark = false;

      if (currentTheme === "Dark") {
        isDark = true;
      } else if (currentTheme === "System") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    // If System mode is active, listen for OS dark mode changes
    if (theme === "System") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        if (e.matches) root.classList.add("dark");
        else root.classList.remove("dark");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Sync theme setting when changed in Settings
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...saved, theme: newTheme })
      );
    } catch {
      // ignore storage error
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}