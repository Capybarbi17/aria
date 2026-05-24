export default function StatCard({ label, value, subtext, icon, trend }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgb(225,224,249)] text-indigo-600">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        {trend && (
          <span
            className={`mb-1 text-xs font-semibold ${
              trend.positive ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
    </div>
  )
}
