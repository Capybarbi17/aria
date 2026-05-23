export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) {
  const base =
    'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
