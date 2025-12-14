import { FormEvent, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../state/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const r = await api.post('/api/auth/login', { email, password })
      const token = r.data.access_token as string
      // decode role by fetching profile (quick way since backend login returns only token)
      // here we infer role by calling a protected route that returns sweets or failing; better approach is to add /me
      login(token, { id: 0, email, role: await inferRole(token) })
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl bg-white/80 dark:bg-black/30 backdrop-blur">
      <h1 className="text-2xl font-bold mb-4 text-candy-purple">Login</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="px-3 py-2 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="px-3 py-2 rounded border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 rounded bg-candy-pink text-white">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  )
}

async function inferRole(token: string): Promise<'user'|'admin'> {
  try {
    // Try an admin-only call that should fail for user
    await api.post('/api/sweets', { name:'x', category:'x', price:0, quantity:0 }, { headers: { Authorization: `Bearer ${token}` } })
    return 'admin'
  } catch {
    return 'user'
  }
}
