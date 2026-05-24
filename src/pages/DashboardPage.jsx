import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import StatCard from '../components/dashboard/StatCard'
import ProgrammeCard from '../components/dashboard/ProgrammeCard'
import {
  computeDashboardStats,
  daysUntilDeadline,
  deadlineTimelinePercent,
} from '../lib/dashboard'

function formatDeadline(deadline) {
  if (!deadline) return null
  return new Date(deadline + 'T00:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatIcons() {
  return {
    folder: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
    users: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    clock: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    chart: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
      </svg>
    ),
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copiedSlug, setCopiedSlug] = useState(null)
  const icons = StatIcons()

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data, error } = await supabase
        .from('programmes')
        .select(
          'id, title, location, slug, deadline, created_at, applications(id, status, ai_verdict)'
        )
        .eq('org_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProgrammes(data)
      }
      setLoading(false)
    }

    load()
  }, [user])

  const stats = useMemo(() => computeDashboardStats(programmes), [programmes])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return programmes
    return programmes.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
    )
  }, [programmes, search])

  async function handleCopyLink(url, slug) {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch {
      setCopiedSlug(null)
    }
  }

  return (
    <div className="-mx-4 -mt-2 px-1 sm:mx-0 sm:mt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Your programme folders{user?.email ? ` · ${user.email}` : ''}
          </p>
        </div>
        <Link
          to="/programmes/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700"
        >
          <span className="text-lg leading-none">+</span>
          Post programme
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Programmes"
          value={loading ? '—' : stats.totalProgrammes}
          subtext="Active listings"
          icon={icons.folder}
        />
        <StatCard
          label="Total Applicants"
          value={loading ? '—' : stats.totalApplicants}
          subtext="Across all programmes"
          icon={icons.users}
        />
        <StatCard
          label="Pending Review"
          value={loading ? '—' : stats.pendingReview}
          subtext="Awaiting action"
          icon={icons.clock}
        />
        <StatCard
          label="AI Reviewed"
          value={loading ? '—' : `${stats.engagementRate}%`}
          subtext="Applicants scored by AI"
          icon={icons.chart}
        />
      </div>

      {!loading && programmes.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programmes…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M7 8h10M10 12h4M12 16h0"
              />
            </svg>
            Filter
          </button>
        </div>
      )}

      {loading ? (
        <p className="mt-12 text-center text-slate-500">Loading programmes…</p>
      ) : programmes.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-indigo-200/80 bg-white/80 p-12 text-center">
          <p className="text-lg font-medium text-slate-700">No programmes yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Post your first exchange programme to get a shareable application link.
          </p>
          <Link
            to="/programmes/new"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
          >
            Post a programme
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">No programmes match your search.</p>
      ) : (
        <ul className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.map((programme) => {
            const count = programme.applications?.length ?? 0
            const deadline = formatDeadline(programme.deadline)
            const daysLeft = daysUntilDeadline(programme.deadline)
            const timelinePercent = deadlineTimelinePercent(programme)
            const isDemoBerlin = programme.slug === 'demo-berlin-computer-science'

            return (
              <ProgrammeCard
                key={programme.id}
                programme={programme}
                applicantCount={count}
                deadlineLabel={deadline}
                daysLeft={daysLeft}
                timelinePercent={timelinePercent}
                onCopyLink={(url) => handleCopyLink(url, programme.slug)}
                copyLabel={copiedSlug === programme.slug ? 'Copied!' : 'Copy link'}
                demoAttrs={isDemoBerlin ? { 'data-demo': 'share-link' } : undefined}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
