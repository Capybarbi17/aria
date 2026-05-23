export default function AiBadge({ verdict, score }) {
  if (!verdict && score == null) return null

  const isGreen = verdict === 'green'
  const styles = isGreen
    ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
    : 'bg-red-50 text-red-800 ring-red-200'

  const label = isGreen ? 'Green' : 'Red'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles}`}
    >
      {label}
      {score != null ? ` · ${Math.round(score)}` : ''}
    </span>
  )
}
