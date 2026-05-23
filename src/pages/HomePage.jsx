import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { session, loading } = useAuth()

  if (loading) return null
  return <Navigate to={session ? '/dashboard' : '/login'} replace />
}
