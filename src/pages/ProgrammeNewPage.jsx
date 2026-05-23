import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { generateSlug, getApplyUrl } from '../lib/slug'
import FormField from '../components/ui/FormField'
import TextareaField from '../components/ui/TextareaField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import SharePanel from '../components/programmes/SharePanel'
import DemoHighlight from '../components/demo/DemoHighlight'

export default function ProgrammeNewPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      setError('You must be signed in to post a programme.')
      setLoading(false)
      return
    }

    let slug = generateSlug(title)
    let attempts = 0
    let programme = null

    while (attempts < 3 && !programme) {
      const { data, error: insertError } = await supabase
        .from('programmes')
        .insert({
          org_id: user.id,
          title: title.trim(),
          location: location.trim(),
          description: description.trim(),
          requirements: requirements.trim(),
          slug,
          deadline: deadline || null,
        })
        .select()
        .single()

      if (!insertError) {
        programme = data
        break
      }

      if (insertError.code === '23505') {
        slug = generateSlug(title)
        attempts += 1
        continue
      }

      setError(insertError.message)
      setLoading(false)
      return
    }

    setLoading(false)

    if (!programme) {
      setError('Could not create programme. Please try again.')
      return
    }

    setCreated(programme)
  }

  if (created) {
    const applyUrl = getApplyUrl(created.slug)

    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Programme published</h1>
          <p className="mt-2 text-slate-600">
            <span className="font-medium">{created.title}</span> is live. Share the link below
            so students can apply.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SharePanel url={applyUrl} programmeTitle={created.title} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setCreated(null)
              setTitle('')
              setLocation('')
              setDescription('')
              setRequirements('')
              setDeadline('')
            }}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Post another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Post a programme</h1>
        <p className="mt-1 text-slate-600">
          List a new exchange opportunity and get a shareable application link.
        </p>
      </div>

      <DemoHighlight id="post-form">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {error && <Alert>{error}</Alert>}

        <FormField
          id="title"
          label="Programme title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Berlin — Computer Science Exchange"
          required
        />

        <FormField
          id="location"
          label="Destination / location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Berlin, Germany"
          required
        />

        <FormField
          id="deadline"
          label="Application deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          hint="Optional"
        />

        <TextareaField
          id="description"
          label="Programme description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this exchange about? Duration, benefits, etc."
          required
          rows={4}
        />

        <TextareaField
          id="requirements"
          label="Ideal candidate requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="GPA, field of study, language level, skills… Used by AI when reviewing applicants."
          required
          rows={4}
          hint="Be specific — the AI uses this to score applicants."
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Publishing…' : 'Publish programme'}
        </Button>
      </form>
      </DemoHighlight>
    </div>
  )
}
