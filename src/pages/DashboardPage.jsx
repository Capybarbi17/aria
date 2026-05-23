import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { getApplyUrl } from '../lib/slug'

function formatDeadline(deadline) {
  if (!deadline) return null
  return new Date(deadline + 'T00:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data, error } = await supabase
        .from('programmes')
        .select('id, title, location, slug, deadline, created_at, applications(count)')
        .eq('org_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProgrammes(data)
      }
      setLoading(false)
    }

    load()
  }, [user])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Your programme folders{user?.email ? ` · ${user.email}` : ''}
          </p>
        </div>
        <Link
          to="/programmes/new"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Post programme
        </Link>
      </div>

      {loading ? (
        <p className="mt-12 text-center text-slate-500">Loading programmes…</p>
      ) : programmes.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">No programmes yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Post your first exchange programme to get a shareable application link.
          </p>
          <Link
            to="/programmes/new"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Post a programme
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {programmes.map((programme) => {
            const count = programme.applications?.[0]?.count ?? 0
            const deadline = formatDeadline(programme.deadline)

            const isDemoBerlin = programme.slug === 'demo-berlin-computer-science'

            return (
              <li
                key={programme.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                {...(isDemoBerlin ? { 'data-demo': 'share-link' } : {})}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-slate-900">{programme.title}</h2>
                    <p className="mt-0.5 text-sm text-slate-500">{programme.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {count} applicant{count === 1 ? '' : 's'}
                  </span>
                </div>

                {deadline && (
                  <p className="mt-3 text-xs text-slate-500">Deadline: {deadline}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/programmes/${programme.id}`}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    Open folder
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(getApplyUrl(programme.slug))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Copy link
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
