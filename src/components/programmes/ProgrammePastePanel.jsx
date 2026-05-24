import { useState } from 'react'
import { extractProgrammeFromText } from '../../lib/ai'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

const EXAMPLE_SNIPPET = `Berlin Computer Science Exchange — Fall 2026
Destination: Berlin, Germany
Deadline: September 1, 2026

A funded semester exchange for CS students with partner universities in Berlin.
Includes tuition support and housing stipend.

Requirements: CS or related field, minimum GPA 3.2, B2 German or English, strong motivation and programming experience.`

export default function ProgrammePastePanel({ onExtracted }) {
  const [pasteText, setPasteText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')

  async function handleExtract() {
    setError('')
    setExtracting(true)

    try {
      const fields = await extractProgrammeFromText(pasteText)
      onExtracted(fields)
    } catch (err) {
      setError(err.message || 'Could not extract programme details. Try again.')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-slate-900">AI programme assistant</p>
        <p className="text-xs text-slate-500">
          Paste a call for applications, email, or brochure — we fill the form for you
        </p>
      </div>

      <div className="flex max-h-[min(520px,70vh)] flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm">
            ✨
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <p>
              Hi! Paste your full exchange programme call below — from a PDF, email, or
              website. I&apos;ll extract the title, location, description, requirements, and
              deadline into the right fields.
            </p>
            <button
              type="button"
              onClick={() => setPasteText(EXAMPLE_SNIPPET)}
              className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Try an example
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
            You
          </div>
          <div className="min-w-0 flex-1">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your programme announcement here…"
              rows={12}
              className="w-full resize-y rounded-2xl rounded-tl-sm border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {pasteText.trim().length > 0
                ? `${pasteText.trim().length} characters`
                : 'Include deadlines and candidate requirements when possible'}
            </p>
          </div>
        </div>

        {extracting && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm">
              ✨
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              Reading your programme and filling the fields…
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-4 sm:p-6">
        {error && (
          <div className="mb-4">
            <Alert>{error}</Alert>
          </div>
        )}
        <Button
          type="button"
          onClick={handleExtract}
          disabled={extracting || !pasteText.trim()}
        >
          {extracting ? 'Extracting…' : 'Extract fields with AI'}
        </Button>
      </div>
    </div>
  )
}
