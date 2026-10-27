export function formatLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function isScheduledDay(date, frequency) {
  const day = date.getDay();
  if (frequency === "Weekdays") return day >= 1 && day <= 5;
  if (frequency === "Weekends") return day === 0 || day === 6;
  return true;
}

function shiftToScheduledDay(date, frequency, direction) {
  const shifted = new Date(date);
  do {
    shifted.setDate(shifted.getDate() + direction);
  } while (!isScheduledDay(shifted, frequency));
  return shifted;
}

export function calculateHabitStreaks(
  completedDates = [],
  frequency = "Every day",
  referenceDate = new Date()
) {
  const completed = new Set(
    completedDates.filter((key) => {
      const date = parseDateKey(key);
      return date && isScheduledDay(date, frequency);
    })
  );
  const sortedDates = [...completed].sort();

  let best = 0;
  let run = 0;
  let previousDate = null;
  for (const key of sortedDates) {
    const date = parseDateKey(key);
    const expectedNext = previousDate
      ? formatLocalDateKey(shiftToScheduledDay(previousDate, frequency, 1))
      : null;
    run = expectedNext === key ? run + 1 : 1;
    best = Math.max(best, run);
    previousDate = date;
  }

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const todayKey = formatLocalDateKey(today);
  let currentDate =
    isScheduledDay(today, frequency) && completed.has(todayKey)
      ? today
      : shiftToScheduledDay(today, frequency, -1);

  let current = 0;
  while (completed.has(formatLocalDateKey(currentDate))) {
    current += 1;
    currentDate = shiftToScheduledDay(currentDate, frequency, -1);
  }

  return { current, best };
}
