import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedProfiles = [] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="screen-loader">Carregando sessão...</div>
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedProfiles.length && !allowedProfiles.includes(user.perfil)) {
    return <Navigate to={user.perfil === 'admin' ? '/admin' : '/app'} replace />
  }

  return <Outlet />
}
