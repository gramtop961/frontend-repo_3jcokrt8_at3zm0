import { useMemo } from 'react'

export default function Cart({ items, onInc, onDec, onRemove, onPlaceOrder, table, setTable, placedBy, setPlacedBy, payNow, setPayNow, paymentMethod, setPaymentMethod, note, setNote }) {
  const total = useMemo(() => items.reduce((s, it) => s + Number(it.price) * it.qty, 0), [items])

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Order</h3>
        <span className="text-blue-300 text-sm">Total: ${total.toFixed(2)}</span>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-blue-200">No items added</p>
        )}
        {items.map(it => (
          <div key={it.id} className="flex items-start justify-between gap-3 bg-slate-900/40 rounded-lg p-3">
            <div>
              <p className="text-white font-medium">{it.name}</p>
              <p className="text-blue-300 text-sm">${Number(it.price).toFixed(2)} × {it.qty}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onDec(it.id)} className="px-2 py-1 bg-slate-700 text-white rounded">-</button>
              <button onClick={() => onInc(it.id)} className="px-2 py-1 bg-slate-700 text-white rounded">+</button>
              <button onClick={() => onRemove(it.id)} className="px-2 py-1 bg-red-600 text-white rounded">×</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-blue-200 text-sm mb-1">Table</label>
          <input value={table} onChange={(e)=>setTable(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700 text-white" placeholder="e.g., 12" />
        </div>
        <div>
          <label className="block text-blue-200 text-sm mb-1">Placed by</label>
          <select value={placedBy} onChange={(e)=>setPlacedBy(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700 text-white">
            <option value="user">User</option>
            <option value="waiter">Waiter</option>
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label className="inline-flex items-center gap-2 text-blue-200 text-sm">
          <input type="checkbox" checked={payNow} onChange={(e)=>setPayNow(e.target.checked)} />
          Pay now
        </label>
      </div>

      {payNow && (
        <div className="mt-3">
          <label className="block text-blue-200 text-sm mb-1">Payment Method</label>
          <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700 text-white">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-blue-200 text-sm mb-1">Notes</label>
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} rows={2} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700 text-white" placeholder="Any special instructions" />
      </div>

      <button
        disabled={items.length===0 || !table}
        onClick={() => onPlaceOrder()}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md px-4 py-2"
      >
        Place order
      </button>
    </div>
  )
}
