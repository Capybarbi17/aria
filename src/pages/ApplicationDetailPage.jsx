import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatDateTime } from '../lib/format'
import AiAssistantPanel from '../components/applications/AiAssistantPanel'
import DemoHighlight from '../components/demo/DemoHighlight'

export default function ApplicationDetailPage() {
  const { id: programmeId, appId } = useParams()
  const [application, setApplication] = useState(null)
  const [programme, setProgramme] = useState(null)
  const [cvUrl, setCvUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: app, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', appId)
        .eq('programme_id', programmeId)
        .maybeSingle()

      if (error || !app) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setApplication(app)

      const { data: prog } = await supabase
        .from('programmes')
        .select('id, title, location, requirements')
        .eq('id', programmeId)
        .single()

      setProgramme(prog)

      if (app.cv_url) {
        const { data: signed } = await supabase.storage
          .from('cvs')
          .createSignedUrl(app.cv_url, 3600)

        if (signed?.signedUrl) setCvUrl(signed.signedUrl)
      }

      setLoading(false)
    }

    if (programmeId && appId) load()
  }, [programmeId, appId])

  if (loading) {
    return <p className="text-slate-500">Loading application…</p>
  }

  if (notFound || !application) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Application not found</h1>
        <Link
          to={`/programmes/${programmeId}`}
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Back to folder
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to={`/programmes/${programmeId}`}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← {programme?.title ?? 'Back to folder'}
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{application.full_name}</h1>
                <p className="mt-1 text-slate-600">{application.email}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                {application.status}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-slate-500">Phone</dt>
                <dd className="mt-0.5 text-slate-900">{application.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-500">GPA</dt>
                <dd className="mt-0.5 text-slate-900">{application.gpa ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-500">Language</dt>
                <dd className="mt-0.5 text-slate-900">{application.language_level || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-500">Submitted</dt>
                <dd className="mt-0.5 text-slate-900">{formatDateTime(application.created_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Motivational letter</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {application.motivation}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">CV</h2>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Open in new tab
                </a>
              )}
            </div>
            {cvUrl ? (
              <iframe
                title="Candidate CV"
                src={cvUrl}
                className="mt-4 h-[min(70vh,520px)] w-full rounded-lg border border-slate-200 bg-slate-50"
              />
            ) : (
              <p className="mt-3 text-sm text-slate-500">CV not available.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {programme && (
            <DemoHighlight id="ai-panel">
              <AiAssistantPanel
                application={application}
                programme={programme}
                onUpdated={setApplication}
              />
            </DemoHighlight>
          )}
        </div>
      </div>
    </div>
  )
}
