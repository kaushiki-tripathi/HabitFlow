import Card from "../ui/Card";

export default function ProgressBar({
  value,
  title = "This week's progress",
  caption = "One habit at a time.",
}) {
  const progress = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <Card className="mb-6 rounded-3xl border border-[#E8DFD6] bg-[#FFFCFA] p-6 shadow-[0_8px_30px_rgba(44,38,31,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl text-[#2C261F]">{title}</h2>
        <span className="font-serif text-xl text-[#8C7465]">{progress}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[#EFE5DB]"
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-[#8C7465] transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-[#9A8776]">{caption}</p>
    </Card>
  );
}