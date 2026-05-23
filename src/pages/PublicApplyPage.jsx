import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import FormField from '../components/ui/FormField'
import TextareaField from '../components/ui/TextareaField'
import SelectField, { LANGUAGE_LEVELS } from '../components/ui/SelectField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import DemoHighlight from '../components/demo/DemoHighlight'

const MAX_CV_BYTES = 5 * 1024 * 1024

function formatDeadline(deadline) {
  if (!deadline) return null
  return new Date(deadline + 'T00:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PublicApplyPage() {
  const { slug } = useParams()

  const [programme, setProgramme] = useState(null)
  const [loadingProgramme, setLoadingProgramme] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gpa, setGpa] = useState('')
  const [languageLevel, setLanguageLevel] = useState('')
  const [motivation, setMotivation] = useState('')
  const [cvFile, setCvFile] = useState(null)

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function loadProgramme() {
      setLoadingProgramme(true)
      const { data, error } = await supabase
        .from('programmes')
        .select('id, title, location, description, requirements, deadline, slug')
        .eq('slug', slug)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
      } else {
        setProgramme(data)
      }
      setLoadingProgramme(false)
    }

    if (slug) loadProgramme()
  }, [slug])

  function handleCvChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      setCvFile(null)
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.')
      e.target.value = ''
      setCvFile(null)
      return
    }

    if (file.size > MAX_CV_BYTES) {
      setError('CV must be 5 MB or smaller.')
      e.target.value = ''
      setCvFile(null)
      return
    }

    setError('')
    setCvFile(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!programme) return

    const gpaNum = parseFloat(gpa)
    if (Number.isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
      setError('GPA must be a number between 0.0 and 4.0.')
      return
    }

    if (!cvFile) {
      setError('Please upload your CV (PDF).')
      return
    }

    setSubmitting(true)

    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('programme_id', programme.id)
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (existing) {
      setError('An application with this email already exists for this programme.')
      setSubmitting(false)
      return
    }

    const filePath = `${programme.id}/${crypto.randomUUID()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, cvFile, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      setError(uploadError.message || 'Failed to upload CV. Please try again.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('applications').insert({
      programme_id: programme.id,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      gpa: gpaNum,
      language_level: languageLevel || null,
      motivation: motivation.trim(),
      cv_url: filePath,
      status: 'applied',
    })

    setSubmitting(false)

    if (insertError) {
      if (insertError.code === '23505') {
        setError('You have already applied to this programme with this email.')
      } else {
        setError(insertError.message)
      }
      return
    }

    setSubmitted(true)
  }

  if (loadingProgramme) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-500">
        Loading programme…
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Programme not found</h1>
          <p className="mt-2 text-slate-600">
            This application link is invalid or the programme is no longer available.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Go to ExchangeHub
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">
        <div className="max-w-md rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Application submitted</h1>
          <p className="mt-3 text-slate-600">
            Your application for <strong>{programme.title}</strong> was sent to the organization.
            You will be notified of the outcome.
          </p>
        </div>
      </div>
    )
  }

  const deadline = formatDeadline(programme.deadline)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-indigo-600">
          ExchangeHub Application
        </p>

        <DemoHighlight id="apply-header">
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">{programme.title}</h1>
          <p className="mt-1 text-slate-600">{programme.location}</p>
          {deadline && (
            <p className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              Apply by {deadline}
            </p>
          )}

          {programme.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">About this programme</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {programme.description}
              </p>
            </div>
          )}

          {programme.requirements && (
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <h2 className="text-sm font-semibold text-indigo-900">What we&apos;re looking for</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-indigo-900/80">
                {programme.requirements}
              </p>
            </div>
          )}
        </div>
        </DemoHighlight>

        <DemoHighlight id="apply-form">
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900">Your application</h2>
          <p className="text-sm text-slate-500">No account needed — fill in the form below.</p>

          {error && <Alert>{error}</Alert>}

          <FormField
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            required
            autoComplete="name"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@university.edu"
              required
              autoComplete="email"
            />
            <FormField
              id="phone"
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 123 456 7890"
              required
              autoComplete="tel"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="gpa"
              label="GPA"
              type="number"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="3.5"
              required
              hint="Scale 0.0 – 4.0"
            />
            <SelectField
              id="languageLevel"
              label="Language level"
              value={languageLevel}
              onChange={(e) => setLanguageLevel(e.target.value)}
              options={LANGUAGE_LEVELS}
              hint="Optional — CEFR level"
            />
          </div>

          <TextareaField
            id="motivation"
            label="Motivational letter"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Why do you want to join this programme?"
            required
            rows={6}
          />

          <div>
            <label htmlFor="cv" className="block text-sm font-medium text-slate-700">
              CV (PDF) <span className="text-red-500">*</span>
            </label>
            <input
              id="cv"
              name="cv"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleCvChange}
              required
              className="mt-1.5 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:border-indigo-300"
            />
            <p className="mt-1 text-xs text-slate-500">PDF only, max 5 MB</p>
            {cvFile && (
              <p className="mt-1 text-xs font-medium text-emerald-700">Selected: {cvFile.name}</p>
            )}
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </form>
        </DemoHighlight>
      </div>
    </div>
  )
}
