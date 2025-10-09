interface BpmProgressCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const BpmProgressCheckbox = ({
  checked,
  onChange,
}: BpmProgressCheckboxProps) => {
  return (
    <div className="flex items-center gap-2 bg-gray-700/30 p-3 rounded-lg">
      <input
        type="checkbox"
        id="readyForFaster"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
      />
      <label
        htmlFor="readyForFaster"
        className="text-sm text-gray-300 cursor-pointer select-none"
      >
        Ready for faster BPM (+1 next time) 🚀
      </label>
    </div>
  );
};

export default BpmProgressCheckbox;
