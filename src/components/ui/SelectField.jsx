const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export { LANGUAGE_LEVELS }

export default function SelectField({
  id,
  label,
  value,
  onChange,
  required,
  hint,
  placeholder = 'Select…',
  options,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
