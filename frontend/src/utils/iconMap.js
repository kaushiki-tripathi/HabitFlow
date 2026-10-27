import { Dumbbell, BookOpen, Code, Droplets, Brain } from "lucide-react";

export const iconMap = [
  { keywords: ["gym", "workout", "exercise", "fitness"], icon: Dumbbell },
  { keywords: ["read", "book", "study"], icon: BookOpen },
  { keywords: ["code", "program", "dev", "dsa"], icon: Code },
  { keywords: ["water", "drink", "hydrate"], icon: Droplets },
  { keywords: ["meditate", "focus", "mind"], icon: Brain },
];

export const getIconFromTitle = (title) => {
  const lower = title.toLowerCase();

  for (const item of iconMap) {
    if (item.keywords.some((word) => lower.includes(word))) {
      return item.icon;
    }
  }

  return Code;
};