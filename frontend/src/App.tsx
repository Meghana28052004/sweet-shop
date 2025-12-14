import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import { useAuth } from './state/AuthContext'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen p-4">
      <nav className="flex gap-4 items-center p-3 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur">
        <Link to="/" className="font-bold text-candy-purple">Sweet Shop</Link>
        <div className="ml-auto flex gap-3">
          {!user && <Link to="/login" className="px-3 py-1 rounded bg-candy-sky text-white">Login</Link>}
          {!user && <Link to="/register" className="px-3 py-1 rounded bg-candy-mint text-black">Register</Link>}
          {user && <span className="text-sm opacity-80">{user.email} ({user.role})</span>}
          {user && <button onClick={logout} className="px-3 py-1 rounded bg-candy-pink text-white">Logout</button>}
        </div>
      </nav>
      <div className="mt-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
