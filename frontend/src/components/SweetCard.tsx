import { api, authHeaders } from '../api/client'
import { useAuth } from '../state/AuthContext'

export interface Sweet {
  id: number
  name: string
  category: string
  price: number
  quantity: number
}

export default function SweetCard({ sweet, onChanged }: { sweet: Sweet, onChanged?: ()=>void }) {
  const { token, user } = useAuth()
  const purchase = async () => {
    await api.post(`/api/sweets/${sweet.id}/purchase`, { amount: 1 }, { headers: authHeaders(token) })
    onChanged?.()
  }
  const remove = async () => {
    await api.delete(`/api/sweets/${sweet.id}`, { headers: authHeaders(token) })
    onChanged?.()
  }
  return (
    <div className="p-4 rounded-xl bg-white/80 dark:bg-black/30 backdrop-blur flex flex-col gap-2">
      <div className="font-bold text-lg">{sweet.name}</div>
      <div className="text-sm opacity-80">{sweet.category}</div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">₹ {sweet.price.toFixed(2)}</span>
        <span className="text-sm">Qty: {sweet.quantity}</span>
      </div>
      <button disabled={sweet.quantity === 0} onClick={purchase} className={`px-3 py-1 rounded text-white ${sweet.quantity===0? 'bg-gray-400':'bg-candy-purple'}`}>Purchase</button>
      {user?.role === 'admin' && (
        <button onClick={remove} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
      )}
    </div>
  )
}
