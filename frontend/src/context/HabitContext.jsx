import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  calculateHabitStreaks,
  formatLocalDateKey,
} from "../utils/streaks";

export const HabitContext = createContext(null);
const API_BASE_URL = "http://localhost:5000/api/habits";

// Ensures backend document shape matches what the UI components expect
function normalizeHabit(habit) {
  const title = habit.title ?? habit.name ?? "Untitled habit";
  const completedDates = Array.isArray(habit.completedDates)
    ? habit.completedDates
    : [];
  const todayKey = formatLocalDateKey(new Date());
  const status = habit.status === "Paused"
    ? "Paused"
    : completedDates.includes(todayKey)
      ? "Completed"
      : "Not Started";
  const streaks = calculateHabitStreaks(completedDates, habit.frequency);

  return {
    ...habit,
    id: String(habit.id ?? habit._id),
    title,
    name: title,
    status,
    completedDates,
    current: streaks.current,
    best: streaks.best,
    duration:
      habit.duration ??
      (typeof habit.note === "string" ? habit.note.split("·")[0].trim() : ""),
  };
}

export function HabitProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  // ─── GET: Fetch all user habits from API ───
  const fetchHabits = useCallback(async () => {
    if (!token) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE_URL, {
        headers: getHeaders(),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch habits");
      }

      const rawData = Array.isArray(result.data) ? result.data : [];
      setHabits(rawData.map(normalizeHabit));
    } catch (err) {
      setError(err.message);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  // Automatically fetch habits whenever user logs in or page reloads
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchHabits]);

  // ─── POST: Add a habit ───
  const addHabit = async (newHabit) => {
    if (!token) return;
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newHabit),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add habit");
      }

      const added = normalizeHabit(result.data);
      setHabits((curr) => [added, ...curr]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ─── PATCH: Update a habit ───
  const updateHabit = async (updatedHabit) => {
    if (!token) return;
    const habitId = updatedHabit.id || updatedHabit._id;

    try {
      const res = await fetch(`${API_BASE_URL}/${habitId}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updatedHabit),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update habit");
      }

      const updated = normalizeHabit(result.data);
      setHabits((curr) =>
        curr.map((habit) => (habit.id === updated.id ? updated : habit))
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ─── DELETE: Remove a habit ───
  const deleteHabit = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete habit");
      }

      setHabits((curr) => curr.filter((habit) => habit.id !== String(id)));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ─── PATCH: Toggle completion (Optimistic + Backend Sync) ───
  const toggleHabit = async (habitId) => {
    if (!token) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = formatLocalDateKey(today);
    const todayIndex = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(monday.getDate() - todayIndex);

    // Update immediately, then reconcile against the server response.
    setHabits((curr) =>
      curr.map((habit) => {
        if (habit.id !== String(habitId)) return habit;

        const completedDates = new Set(habit.completedDates || []);
        if (completedDates.has(todayKey)) completedDates.delete(todayKey);
        else completedDates.add(todayKey);
        const nextCompletedDates = [...completedDates].sort();
        const weekDone = Array.from({ length: 7 }, (_, index) => {
          const date = new Date(monday);
          date.setDate(date.getDate() + index);
          return completedDates.has(formatLocalDateKey(date));
        });
        const streaks = calculateHabitStreaks(
          nextCompletedDates,
          habit.frequency,
          today
        );

        return {
          ...habit,
          status: completedDates.has(todayKey) ? "Completed" : "Not Started",
          completedDates: nextCompletedDates,
          weekDone,
          thisWeek: Math.round(
            (weekDone.filter(Boolean).length / 7) * 100
          ),
          current: streaks.current,
          best: streaks.best,
          tag: completedDates.has(todayKey) ? "Completed Today" : "Needs Focus",
          tagColor: completedDates.has(todayKey) ? "green" : "orange",
        };
      })
    );

    // Sync with backend API
    try {
      const res = await fetch(`${API_BASE_URL}/${habitId}/toggle`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ date: todayKey }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle habit");
      }

      // Sync backend state
      const synced = normalizeHabit(result.data);
      setHabits((curr) =>
        curr.map((h) => (h.id === synced.id ? synced : h))
      );
    } catch (err) {
      setError(err.message);
      fetchHabits(); // Rollback on error
    }
  };

  const value = useMemo(
    () => ({
      habits,
      loading,
      error,
      fetchHabits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabit,
    }),
    [habits, loading, error, fetchHabits]
  );

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabit must be used inside HabitProvider");
  return context;
}