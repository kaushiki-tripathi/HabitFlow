export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      aria-label={label || "Toggle value"}
      aria-pressed={checked}
      onClick={onChange}
      className={`flex h-7 w-12 items-center rounded-full border transition-all duration-200 ${
        checked ? "border-[#d86d7d] bg-[#d86d7d]" : "border-gray-200 bg-gray-200"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
