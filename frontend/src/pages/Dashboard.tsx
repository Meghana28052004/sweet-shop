import { useEffect, useState } from 'react'
import { api, authHeaders } from '../api/client'
import { useAuth } from '../state/AuthContext'
import SweetCard, { Sweet } from '../components/SweetCard'
import Filters from '../components/Filters'

export default function Dashboard() {
  const { token } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])

  const load = async (params?: any) => {
    const url = params ? '/api/sweets/search' : '/api/sweets'
    const r = await api.get(url, { params, headers: authHeaders(token) })
    setSweets(r.data)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-5xl mx-auto grid gap-4">
      <Filters onChange={load} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sweets.map(s => <SweetCard key={s.id} sweet={s} onChanged={()=>load()} />)}
      </div>
    </div>
  )
}
