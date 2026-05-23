import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { analyzeCandidate, GREEN_SCORE_THRESHOLD } from '../../lib/ai'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

export default function AiAssistantPanel({ application, programme, onUpdated }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const hasResult = Boolean(application.ai_verdict)
  const isGreen = application.ai_verdict === 'green'

  async function runAnalysis() {
    if (!programme?.requirements) {
      setError('This programme has no requirements set for AI to evaluate.')
      return
    }

    setError('')
    setAnalyzing(true)

    try {
      const result = await analyzeCandidate(programme, application)

      const { data, error: updateError } = await supabase
        .from('applications')
        .update({
          ai_score: result.score,
          ai_verdict: result.verdict,
          ai_reason: result.reason,
        })
        .eq('id', application.id)
        .select()
        .single()

      if (updateError) throw new Error(updateError.message)

      onUpdated(data)
    } catch (err) {
      setError(err.message || 'AI analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">AI assistant</h2>
      <p className="mt-1 text-xs text-slate-500">
        Compares this candidate to your programme requirements
      </p>

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {analyzing && (
        <div className="mt-6 flex flex-col items-center rounded-xl bg-indigo-50 py-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-indigo-900">
            Claude is reviewing this candidate…
          </p>
        </div>
      )}

      {!analyzing && hasResult && (
        <div className="mt-6 space-y-4">
          <div
            className={`rounded-xl border p-4 ${
              isGreen
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isGreen ? '🟢' : '🔴'}</span>
              <div>
                <p
                  className={`text-sm font-bold uppercase tracking-wide ${
                    isGreen ? 'text-emerald-800' : 'text-red-800'
                  }`}
                >
                  {isGreen ? 'Green flag' : 'Red flag'}
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isGreen ? 'text-emerald-900' : 'text-red-900'
                  }`}
                >
                  {Math.round(application.ai_score)}
                  <span className="text-lg font-medium opacity-70">/100</span>
                </p>
              </div>
            </div>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                isGreen ? 'text-emerald-900/90' : 'text-red-900/90'
              }`}
            >
              {application.ai_reason}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Score ≥ {GREEN_SCORE_THRESHOLD} = green flag. Below = red flag.
          </p>

          <Button type="button" variant="ghost" onClick={runAnalysis}>
            Re-analyze
          </Button>
        </div>
      )}

      {!analyzing && !hasResult && (
        <div className="mt-6">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-600">Not analyzed yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Get an instant fit score and green/red recommendation
            </p>
          </div>
          <div className="mt-4">
            <Button type="button" onClick={runAnalysis}>
              Analyze with AI
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
