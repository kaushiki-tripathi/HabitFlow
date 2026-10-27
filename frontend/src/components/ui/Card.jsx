export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}