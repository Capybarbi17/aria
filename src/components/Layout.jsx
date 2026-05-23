import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="text-lg font-bold tracking-tight text-indigo-600">
            ARIA
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
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
            {user?.email && (
              <span className="hidden max-w-[140px] truncate px-2 text-xs text-slate-400 sm:inline">
                {user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
