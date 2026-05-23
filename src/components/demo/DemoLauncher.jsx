import { useDemo } from '../../contexts/DemoContext'

export default function DemoLauncher({ className = '', variant = 'primary' }) {
  const { startDemo, loading, error } = useDemo()

  const styles =
    variant === 'outline'
      ? 'border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'

  return (
    <div className={className}>
      <button
        type="button"
        onClick={startDemo}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 w-full sm:w-auto ${styles}`}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Preparing demo…
          </>
        ) : (
          <>▶ Start interactive demo</>
        )}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  )
}
