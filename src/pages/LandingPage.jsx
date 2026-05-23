import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const STEPS = [
  {
    step: '01',
    title: 'Post a programme',
    desc: 'Organizations list exchange opportunities with requirements AI uses to score applicants.',
    icon: '📋',
  },
  {
    step: '02',
    title: 'Share one link',
    desc: 'Get a URL instantly — share on WhatsApp, email, or social. No student accounts needed.',
    icon: '🔗',
  },
  {
    step: '03',
    title: 'Students apply',
    desc: 'Structured forms replace inbox chaos: motivation, GPA, CV, and contact details in one place.',
    icon: '✍️',
  },
  {
    step: '04',
    title: 'AI reviews candidates',
    desc: 'ARIA flags strong matches green and weak ones red — with a score and one-line reason.',
    icon: '✨',
  },
]

export default function LandingPage() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-indigo-300">
        Loading…
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden
        className="landing-orb pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="landing-orb pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl"
        style={{ animationDelay: '2s' }}
      />
      <div
        aria-hidden
        className="landing-orb pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
        style={{ animationDelay: '4s' }}
      />

      <header className="landing-animate-in relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="text-2xl font-black tracking-tighter text-white">ARIA</span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 hover:shadow-indigo-400/40"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="landing-animate-in landing-delay-1 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Exchange programme platform
            </p>

            <h1 className="landing-animate-in landing-delay-2 mt-4 text-6xl font-black leading-none tracking-tighter sm:text-7xl lg:text-8xl">
              <span className="landing-gradient-text">ARIA</span>
            </h1>

            <p className="landing-animate-in landing-delay-3 mt-4 text-xl font-semibold leading-snug text-indigo-200 sm:text-2xl">
              Application Review &amp; Intelligence Assistant
            </p>

            <p className="landing-animate-in landing-delay-4 mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              Turn 40 hours of reading emails and PDFs into minutes. Post programmes, share apply
              links, and let AI rank every candidate with green and red flags.
            </p>

            <div className="landing-animate-in landing-delay-5 mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="group relative overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-950 transition hover:scale-105"
              >
                <span className="relative z-10">Sign in to your organization →</span>
                <span className="landing-shimmer absolute inset-0 opacity-0 group-hover:opacity-100" />
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-indigo-400/50 hover:bg-white/5"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="landing-preview-slide relative">
            <div className="landing-float relative rounded-2xl border border-white/10 bg-white/5 p-1 shadow-2xl shadow-indigo-900/50 backdrop-blur-xl">
              <div className="rounded-xl bg-slate-900/90 p-5 sm:p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs text-slate-500">aria.app / dashboard</span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Berlin — Computer Science</span>
                    <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-xs text-indigo-200">
                      3 applicants
                    </span>
                  </div>

                  {[
                    { name: 'Alex Chen', score: 88, flag: 'green' },
                    { name: 'Jordan Smith', score: 32, flag: 'red' },
                    { name: 'Samira Patel', score: 79, flag: 'green' },
                  ].map((c) => (
                    <div
                      key={c.name}
                      className="landing-card-hover flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm text-slate-200">{c.name}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          c.flag === 'green'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {c.flag === 'green' ? '🟢' : '🔴'} {c.score}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="landing-float-slow mt-5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">
                    AI assistant
                  </p>
                  <p className="mt-1 text-sm text-indigo-100">
                    Strong CS fit with excellent GPA and relevant experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How ARIA works</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            From posting a programme to AI-ranked shortlists — four steps, zero spreadsheet chaos.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, i) => (
            <article
              key={item.step}
              className="landing-card-hover landing-animate-in rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <span className="text-3xl">{item.icon}</span>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-400">
                Step {item.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="landing-flow-line mx-auto mt-12 h-1 max-w-2xl rounded-full opacity-60" />
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="landing-animate-in overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/40 via-violet-600/30 to-slate-900 p-10 text-center sm:p-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Ready to review smarter?
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            <span className="landing-gradient-text">ARIA</span> — Application Review &amp;
            Intelligence Assistant
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-300">
            Log in as an organization, post your first programme, and share the apply link in under
            a minute.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex rounded-full bg-white px-10 py-4 text-sm font-bold text-indigo-950 transition hover:scale-105 hover:shadow-xl hover:shadow-white/20"
          >
            Go to login →
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-slate-600">
        ARIA · Application Review &amp; Intelligence Assistant
      </footer>
    </div>
  )
}
