import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { emailInitials } from '../lib/dashboard'

export default function Layout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const initials = emailInitials(user?.email)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                A
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">ARIA</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                to="/programmes/new"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Post
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user?.email && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-2 py-1.5 pr-3 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(225,224,249)] text-xs font-bold text-indigo-700">
                  {initials}
                </span>
                <span className="hidden max-w-[160px] truncate text-sm text-slate-600 md:inline">
                  {user.email}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              title="Log out"
            >
              <span className="sm:hidden">Out</span>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
