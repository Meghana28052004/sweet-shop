import { useState } from 'react'

export default function Filters({ onChange }: { onChange: (q: {name?: string, category?: string, minPrice?: number, maxPrice?: number}) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMin] = useState('')
  const [maxPrice, setMax] = useState('')

  const submit = () => {
    onChange({
      name: name || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <input className="px-3 py-2 rounded border" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="px-3 py-2 rounded border" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      <input className="px-3 py-2 rounded border w-28" placeholder="Min" value={minPrice} onChange={e=>setMin(e.target.value)} />
      <input className="px-3 py-2 rounded border w-28" placeholder="Max" value={maxPrice} onChange={e=>setMax(e.target.value)} />
      <button onClick={submit} className="px-3 py-2 rounded bg-candy-sky text-white">Search</button>
    </div>
  )
}
