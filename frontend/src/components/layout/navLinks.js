export const APP_NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Habits", to: "/habits" },
  { label: "Weekly", to: "/weekly" },
  { label: "Monthly", to: "/monthly" },
  { label: "Settings", to: "/settings" },
];

export function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}