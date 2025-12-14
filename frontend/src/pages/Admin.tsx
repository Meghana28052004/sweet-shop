import { FormEvent, useEffect, useState } from 'react'
import { api, authHeaders } from '../api/client'
import { useAuth } from '../state/AuthContext'
import { Sweet } from '../components/SweetCard'

export default function Admin() {
  const { token } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [form, setForm] = useState({ name: '', category: '', price: '0', quantity: '0' })

  const load = async () => {
    const r = await api.get('/api/sweets', { headers: authHeaders(token) })
    setSweets(r.data)
  }
  useEffect(() => { load() }, [])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/api/sweets', {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity)
    }, { headers: authHeaders(token) })
    setForm({ name: '', category: '', price: '0', quantity: '0' })
    load()
  }

  const restock = async (id: number) => {
    await api.post(`/api/sweets/${id}/restock`, { amount: 1 }, { headers: authHeaders(token) })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-6">
      <form onSubmit={create} className="grid gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/30">
        <h2 className="font-bold text-candy-purple">Add Sweet</h2>
        <div className="grid sm:grid-cols-4 gap-2">
          <input className="px-3 py-2 rounded border" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <input className="px-3 py-2 rounded border" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
          <input className="px-3 py-2 rounded border" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
          <input className="px-3 py-2 rounded border" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} />
        </div>
        <button className="px-4 py-2 rounded bg-candy-purple text-white w-min">Create</button>
      </form>

      <div className="grid gap-3">
        {sweets.map(s => (
          <div key={s.id} className="p-3 rounded bg-white/80 dark:bg-black/30 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm opacity-80">{s.category} · ₹{s.price} · Qty {s.quantity}</div>
            </div>
            <button onClick={()=>restock(s.id)} className="px-3 py-1 rounded bg-candy-mint">Restock +1</button>
          </div>
        ))}
      </div>
    </div>
  )
}
