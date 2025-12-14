import { FormEvent, useState } from 'react'
import { api } from '../api/client'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/api/auth/register', { email, password })
      nav('/login')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl bg-white/80 dark:bg-black/30 backdrop-blur">
      <h1 className="text-2xl font-bold mb-4 text-candy-mint">Register</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="px-3 py-2 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="px-3 py-2 rounded border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 rounded bg-candy-mint">Register</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  )
}
