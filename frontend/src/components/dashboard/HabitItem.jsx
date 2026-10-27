import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import Toggle from "../ui/Toggle";

function HabitItem({
  title,
  duration,
  category,
  status,
  icon: Icon,
  onToggle,
  onDelete,
}) {
  const isCompleted = status === "Completed";

  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            isCompleted ? "bg-garden-green/20 text-garden-green" : "bg-gray-100 text-gray-500"
          }`}
        >
          <Icon size={24} />
        </div>

        <div>
          <h4
            className={`text-lg font-bold ${
              isCompleted ? "line-through text-gray-400" : "text-garden-dark"
            }`}
          >
            {title}
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-400">{duration}</p>
            {category && (
              <span className="rounded-full bg-garden-rose/10 px-2 py-1 text-xs font-semibold text-garden-rose">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Toggle checked={isCompleted} onChange={onToggle} label={`Toggle ${title}`} />

        <button onClick={onDelete} className="rounded-lg bg-red-100 p-2 text-red-500 hover:bg-red-200">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default HabitItem;
