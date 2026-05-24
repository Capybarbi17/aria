import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/ui/FormField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()

  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, authLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          organization_name: orgName.trim(),
          phone: phone.trim() || '',
        },
      },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    if (!data.user) {
      setLoading(false)
      setError('Could not create account. Please try again.')
      return
    }

    if (data.session) {
      setLoading(false)
      navigate('/dashboard', { replace: true })
      return
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signInData?.session) {
      navigate('/dashboard', { replace: true })
      return
    }

    const needsConfirmation =
      signInError?.message?.toLowerCase().includes('email not confirmed') ||
      signInError?.message?.toLowerCase().includes('not confirmed')

    if (needsConfirmation) {
      setSuccess(
        'Account created! Check your email to confirm your address, then sign in.'
      )
      return
    }

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/login', {
      replace: true,
      state: { message: 'Account created. Sign in to continue.' },
    })
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    )
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register as an exchange organization"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <FormField
          id="orgName"
          label="Organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. Global Exchange NGO"
          required
          autoComplete="organization"
        />

        <FormField
          id="email"
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@organization.org"
          required
          autoComplete="email"
        />

        <FormField
          id="phone"
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+49 123 456 7890"
          autoComplete="tel"
          hint="Optional — shown to applicants if needed later"
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          autoComplete="new-password"
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          required
          autoComplete="new-password"
        />

        <Button type="submit" disabled={loading || !!success}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
