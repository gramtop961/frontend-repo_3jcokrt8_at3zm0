import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'
import Cart from './components/Cart'
import KitchenBoard from './components/KitchenBoard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [cart, setCart] = useState([])
  const [table, setTable] = useState('')
  const [placedBy, setPlacedBy] = useState('user')
  const [payNow, setPayNow] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [note, setNote] = useState('')
  const [activeTab, setActiveTab] = useState('order')

  const addToCart = (dish) => {
    setCart(prev => {
      const found = prev.find(i => i.id === dish.id)
      if (found) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, qty: 1 }]
    })
  }

  const inc = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i))
  const dec = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const placeOrder = async () => {
    const items = cart.map(i => ({ dish_id: i.id, quantity: i.qty }))
    const body = { table_number: table, placed_by: placedBy, items, pay_now: payNow, payment_method: payNow ? paymentMethod : null, notes: note }
    const res = await fetch(`${API}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      const data = await res.json()
      alert(`Order created for table ${data.table_number}`)
      setCart([])
      setTable('')
      setPayNow(false)
      setNote('')
      setActiveTab('kitchen')
    } else {
      const err = await res.json().catch(()=>({detail:'Unknown error'}))
      alert(`Failed to create order: ${err.detail}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="relative mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => setActiveTab('order')} className={`px-3 py-1.5 rounded-md text-sm ${activeTab==='order'?'bg-blue-600 text-white':'text-blue-200 hover:bg-blue-600/20'}`}>Order</button>
          <button onClick={() => setActiveTab('kitchen')} className={`px-3 py-1.5 rounded-md text-sm ${activeTab==='kitchen'?'bg-blue-600 text-white':'text-blue-200 hover:bg-blue-600/20'}`}>Kitchen</button>
        </div>

        {activeTab === 'order' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Menu onAdd={addToCart} />
            </div>
            <div>
              <Cart
                items={cart}
                onInc={inc}
                onDec={dec}
                onRemove={removeItem}
                onPlaceOrder={placeOrder}
                table={table}
                setTable={setTable}
                placedBy={placedBy}
                setPlacedBy={setPlacedBy}
                payNow={payNow}
                setPayNow={setPayNow}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                note={note}
                setNote={setNote}
              />
            </div>
          </div>
        ) : (
          <KitchenBoard />
        )}
      </main>
    </div>
  )
}
