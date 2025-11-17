import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const Stage = ({ label, orders, onAdvance }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
    <h3 className="text-white font-semibold mb-3">{label}</h3>
    <div className="space-y-3">
      {orders.map(o => (
        <div key={o.id} className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Table {o.table_number}</p>
              <p className="text-blue-300 text-xs">{o.items?.length || 0} items</p>
            </div>
            {onAdvance && (
              <button onClick={() => onAdvance(o)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm">Advance</button>
            )}
          </div>
          <ul className="mt-2 text-blue-200 text-sm list-disc pl-5">
            {o.items?.map((it, idx) => (
              <li key={idx}>{it.quantity} × {it.name}</li>
            ))}
          </ul>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-blue-200">No orders</p>
      )}
    </div>
  </div>
)

export default function KitchenBoard() {
  const [queue, setQueue] = useState([])

  const load = async () => {
    const data = await fetch(`${API}/api/kitchen/queue`).then(r=>r.json())
    setQueue(data)
  }

  useEffect(() => { load(); const id = setInterval(load, 3000); return ()=>clearInterval(id) }, [])

  const advance = async (order) => {
    const next = order.status === 'pending' ? 'in_progress' : 'ready'
    await fetch(`${API}/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next })
    })
    load()
  }

  const pending = queue.filter(o => o.status === 'pending')
  const inProgress = queue.filter(o => o.status === 'in_progress')

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Stage label="Pending" orders={pending} onAdvance={advance} />
      <Stage label="In Progress" orders={inProgress} onAdvance={advance} />
    </div>
  )
}
