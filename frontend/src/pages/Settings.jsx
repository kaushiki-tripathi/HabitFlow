import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  ChevronDown,
  Info,
  Moon,
  Palette,
  Sun,
  Settings2,
} from "lucide-react";
import SettingsCard from "../components/settings/SettingsCard";
import SettingsRow from "../components/settings/SettingsRow";
import useHabit from "../hooks/useHabit";
import { useTheme } from "../context/ThemeContext";
import Pageskeleton from "../components/ui/Skeleton";

const SETTINGS_KEY = "habitflow.preferences.v1";

const DEFAULT_PREFERENCES = {
  category: "Personal",
  frequency: "Every day",
  weekStartsOn: "Monday",
  showStreak: true,
  remindersEnabled: true,
  reminderTime: "08:00",
  missedReminders: true,
  sound: "Soft Chime",
  theme: "Light",
  accent: "#8C7465",
};

const accentColors = [
  "#8C7465",
  "#2C261F",
  "#A89080",
  "#6F655C",
  "#C4B2A0",
  "#8A7B6C",
];

const fieldClass =
  "w-full min-w-36 appearance-none rounded-xl border border-[#E8DFD6] bg-[#F7F4EF] px-3 py-2.5 pr-9 text-sm font-medium text-[#2C261F] shadow-inner shadow-white/60 outline-none transition focus:border-[#C4B2A0] focus:bg-[#FFFCFA] focus:ring-4 focus:ring-[#C4B2A0]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3A322A] dark:bg-[#2A241F] dark:text-[#F7F4EF] dark:focus:border-[#8C7465] dark:focus:bg-[#1C1814] dark:focus:ring-[#8C7465]/20";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function readPreferences() {
  try {
    return {
      ...DEFAULT_PREFERENCES,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function PreferenceSelect({ value, onChange, options, label }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className={`${fieldClass} cursor-pointer`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B6C] dark:text-[#A08F7E]"
      />
    </label>
  );
}

function PreferenceToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B2A0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFCFA] dark:focus-visible:ring-offset-[#1C1814] ${
        checked ? "bg-[#8C7465]" : "bg-[#E8DFD6] dark:bg-[#3A322A]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-[#FFFCFA] shadow-sm transition-all duration-200 ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { loading } = useHabit();
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState(readPreferences);
  const [importMessage, setImportMessage] = useState("");

  // Keep local preference state in sync with ThemeContext
  useEffect(() => {
    setPreferences((current) =>
      current.theme === theme ? current : { ...current, theme }
    );
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleThemeChange = (label) => {
    updatePreference("theme", label);
    setTheme(label); // instantly applies / removes .dark on <html>
  };

  if (loading) return <Pageskeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pt-28">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#2C261F] dark:text-[#F7F4EF]">
            Settings
          </h1>
          <p className="mt-2 font-medium text-[#6F655C] dark:text-[#A08F7E]">
            Customize your experience and make HabitFlow work the way you like.
          </p>
        </div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid items-start gap-4 lg:grid-cols-2"
      >
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <SettingsCard
              icon={Settings2}
              title="General preferences"
              description="Set your default habit settings and app behavior."
            >
              <SettingsRow
                label="Default habit category"
                control={
                  <PreferenceSelect
                    label="Default habit category"
                    value={preferences.category}
                    onChange={(value) => updatePreference("category", value)}
                    options={[
                      "Personal",
                      "Health",
                      "Fitness",
                      "Study",
                      "Self-care",
                      "Mindfulness",
                      "Work",
                    ]}
                  />
                }
              />
              <SettingsRow
                label="Default frequency"
                control={
                  <PreferenceSelect
                    label="Default frequency"
                    value={preferences.frequency}
                    onChange={(value) => updatePreference("frequency", value)}
                    options={["Every day", "Weekdays", "Weekends"]}
                  />
                }
              />
              <SettingsRow
                label="Start week on"
                control={
                  <PreferenceSelect
                    label="Start week on"
                    value={preferences.weekStartsOn}
                    onChange={(value) =>
                      updatePreference("weekStartsOn", value)
                    }
                    options={["Monday", "Sunday"]}
                  />
                }
              />
              <SettingsRow
                label="Show streak on habit cards"
                description="Display your current streak on each habit."
                control={
                  <PreferenceToggle
                    label="Show streak on habit cards"
                    checked={preferences.showStreak}
                    onChange={(value) => updatePreference("showStreak", value)}
                  />
                }
              />
            </SettingsCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SettingsCard
              icon={Palette}
              title="Appearance"
              description="Choose a theme and personalize your experience."
            >
              <p className="mb-3 text-sm font-semibold text-[#2C261F] dark:text-[#F7F4EF]">
                Theme
              </p>
              <div className="mb-5 grid grid-cols-3 gap-2.5">
                {[
                  { label: "Light", Icon: Sun },
                  { label: "Dark", Icon: Moon },
                  { label: "System", Icon: Settings2 },
                ].map(({ label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={preferences.theme === label}
                    onClick={() => handleThemeChange(label)}
                    className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition ${
                      preferences.theme === label
                        ? "border-[#8C7465] bg-[#F1EAE2] text-[#2C261F] shadow-sm ring-1 ring-[#8C7465]/20 dark:border-[#C4B2A0] dark:bg-[#2A241F] dark:text-[#F7F4EF]"
                        : "border-[#E8DFD6] bg-[#F7F4EF] text-[#6F655C] hover:bg-[#F4F0EA] dark:border-[#3A322A] dark:bg-[#241F1A] dark:text-[#A08F7E] dark:hover:bg-[#2A241F]"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              <p className="mb-3 text-sm font-semibold text-[#2C261F] dark:text-[#F7F4EF]">
                Accent color
              </p>
              <div className="flex flex-wrap gap-2.5">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set accent color ${color}`}
                    aria-pressed={preferences.accent === color}
                    onClick={() => updatePreference("accent", color)}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition ${
                      preferences.accent === color
                        ? "border-[#FFFCFA] ring-2 ring-[#8C7465]"
                        : "border-[#FFFCFA] hover:ring-2 hover:ring-[#E8DFD6] dark:border-[#1C1814] dark:hover:ring-[#3A322A]"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {preferences.accent === color && (
                      <Check
                        size={15}
                        className="text-[#FFFCFA]"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            </SettingsCard>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <SettingsCard
              icon={Bell}
              title="Reminders"
              description="Get notified to stay consistent with your habits."
            >
              <SettingsRow
                label="Enable daily reminders"
                control={
                  <PreferenceToggle
                    label="Enable daily reminders"
                    checked={preferences.remindersEnabled}
                    onChange={(value) =>
                      updatePreference("remindersEnabled", value)
                    }
                  />
                }
              />
              <SettingsRow
                label="Reminder time"
                control={
                  <input
                    aria-label="Reminder time"
                    type="time"
                    value={preferences.reminderTime}
                    onChange={(event) =>
                      updatePreference("reminderTime", event.target.value)
                    }
                    disabled={!preferences.remindersEnabled}
                    className={fieldClass}
                  />
                }
              />
              <SettingsRow
                label="Missed habit reminders"
                description="Send a gentle reminder if you miss a habit."
                control={
                  <PreferenceToggle
                    label="Missed habit reminders"
                    checked={preferences.missedReminders}
                    onChange={(value) =>
                      updatePreference("missedReminders", value)
                    }
                  />
                }
              />
              <SettingsRow
                label="Sound"
                control={
                  <PreferenceSelect
                    label="Reminder sound"
                    value={preferences.sound}
                    onChange={(value) => updatePreference("sound", value)}
                    options={["Soft Chime", "Gentle Bell", "None"]}
                  />
                }
              />
            </SettingsCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SettingsCard
              icon={Info}
              title="About HabitFlow"
              description="App version and useful information."
            >
              <SettingsRow
                label="Version"
                control={
                  <span className="text-sm font-medium text-[#8A7B6C] dark:text-[#A08F7E]">
                    1.0.0
                  </span>
                }
              />
              
              <SettingsRow
                label="Built by"
                control={
                  <span className="text-sm font-medium text-[#8A7B6C] dark:text-[#A08F7E]">
                    Kaushiki Tripathi
                  </span>
                }
              />
            </SettingsCard>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}