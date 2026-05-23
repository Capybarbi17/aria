import { useDemo } from '../../contexts/DemoContext'
import { getBerlinApplyUrl } from '../../lib/demoSeed'
import { getStepApplyUrl } from '../../lib/demoSteps'

export default function DemoTour() {
  const {
    active,
    step,
    stepIndex,
    totalSteps,
    nextStep,
    prevStep,
    endDemo,
  } = useDemo()

  if (!active || !step) return null

  const applyUrl = getBerlinApplyUrl()
  const isLinkStep = step.id === 'link'
  const isApplyStep = step.id === 'apply' || step.id === 'form'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]" aria-hidden />

      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg sm:left-auto sm:right-6 sm:bottom-6">
        <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-2xl shadow-indigo-900/10">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              Demo {stepIndex + 1} / {totalSteps}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                step.role === 'student'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {step.role === 'student' ? 'Student view' : 'Organization view'}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>

          {isLinkStep && (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/80 p-3" data-demo="share-link">
              <p className="text-xs font-medium text-indigo-800">Example link (Berlin demo)</p>
              <p className="mt-1 break-all text-sm font-mono text-indigo-900">{applyUrl}</p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(applyUrl)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Copy link
              </button>
            </div>
          )}

          {isApplyStep && step.id === 'apply' && (
            <p className="mt-3 text-xs text-slate-500">
              URL pattern: <code className="rounded bg-slate-100 px-1">{getStepApplyUrl()}</code>
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {stepIndex === totalSteps - 1 ? 'Finish' : 'Next step'}
            </button>
            <button
              type="button"
              onClick={endDemo}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
            >
              Exit
            </button>
          </div>

          <div className="mt-3 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= stepIndex ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
