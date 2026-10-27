export default function SectionWrapper({ title, children, right }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-garden-dark">{title}</h2>
        {right && right}
      </div>
      {children}
    </div>
  );
}