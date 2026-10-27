export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-garden-rose text-white hover:opacity-90",
    secondary: "bg-gray-100 text-garden-dark hover:bg-gray-200",
    ghost: "bg-white text-garden-dark border border-gray-200 hover:bg-gray-50",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2.5 font-bold transition ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
