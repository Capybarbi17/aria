import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getApplyUrl } from '../lib/slug'
import { formatDate, formatDateTime } from '../lib/format'
import AiBadge from '../components/applications/AiBadge'
import DemoHighlight from '../components/demo/DemoHighlight'

export default function ProgrammeFolderPage() {
  const { id } = useParams()
  const [programme, setProgramme] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: prog, error: progError } = await supabase
        .from('programmes')
        .select('id, title, location, slug, deadline')
        .eq('id', id)
        .maybeSingle()

      if (progError || !prog) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProgramme(prog)

      const { data: apps } = await supabase
        .from('applications')
        .select(
          'id, full_name, email, gpa, language_level, created_at, ai_score, ai_verdict, status'
        )
        .eq('programme_id', id)
        .order('created_at', { ascending: false })

      setApplications(apps ?? [])
      setLoading(false)
    }

    if (id) load()
  }, [id])

  if (loading) {
    return <p className="text-slate-500">Loading folder…</p>
  }

  if (notFound) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Programme not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const count = applications.length

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Dashboard
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{programme.title}</h1>
          <p className="mt-1 text-slate-600">{programme.location}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {count} candidate{count === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(getApplyUrl(programme.slug))}
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Copy apply link
        </button>
      </div>

      {count === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">No applications yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Share the apply link so students can submit their applications.
          </p>
        </div>
      ) : (
        <DemoHighlight id="applicant-list">
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">GPA</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">AI</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{app.full_name}</p>
                      <p className="text-slate-500">{app.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{app.gpa ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{app.language_level || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(app.created_at)}</td>
                    <td className="px-4 py-3">
                      <AiBadge verdict={app.ai_verdict} score={app.ai_score} />
                      {!app.ai_verdict && (
                        <span className="text-xs text-slate-400">Not analyzed</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/programmes/${id}/applications/${app.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-slate-100 md:hidden">
            {applications.map((app) => (
              <li key={app.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{app.full_name}</p>
                    <p className="text-sm text-slate-500">{app.email}</p>
                  </div>
                  <AiBadge verdict={app.ai_verdict} score={app.ai_score} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  GPA {app.gpa ?? '—'} · {app.language_level || 'No language'} ·{' '}
                  {formatDate(app.created_at)}
                </p>
                <Link
                  to={`/programmes/${id}/applications/${app.id}`}
                  className="mt-3 inline-block text-sm font-medium text-indigo-600"
                >
                  View application →
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </DemoHighlight>
      )}
    </div>
  )
}
