import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle, brand }) {
  const productName = brand?.name ?? 'ExchangeHub'
  const productTagline = brand?.tagline
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="mb-10 lg:mb-0 lg:flex-1">
          <Link to="/" className="block">
            <span className="text-2xl font-bold tracking-tight text-indigo-600">{productName}</span>
            {productTagline && (
              <span className="mt-1 block text-sm font-medium leading-snug text-slate-600">
                {productTagline}
              </span>
            )}
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Manage exchange programmes in one place
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-600">
            Post programmes, share application links, and review candidates with AI-assisted
            screening.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                ✓
              </span>
              Share a link — students apply without an account
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                ✓
              </span>
              Applications grouped by programme
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                ✓
              </span>
              AI flags strong and weak matches instantly
            </li>
          </ul>
        </div>

        <div className="w-full max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
