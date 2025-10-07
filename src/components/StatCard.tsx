export const StatCard = ({
  title,
  label,
  value,
  footer,
}: {
  title: string;
  label?: string;
  value: string;
  footer?: string;
}) => {
  return (
    <div className="flex flex-col justify-between items-baseline p-3 bg-gray-700/50 rounded-lg">
      <div className="flex flex-row items-baseline gap-2 justify-between w-full">
        <span className="text-gray-400">{title}</span>
        {label && <span className="text-gray-400">{label}</span>}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <footer className="text-gray-400 text-sm">{footer}</footer>
    </div>
  );
};
