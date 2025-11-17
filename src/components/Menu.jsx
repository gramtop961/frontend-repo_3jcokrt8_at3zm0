import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Menu({ onAdd }) {
  const [categories, setCategories] = useState([])
  const [dishes, setDishes] = useState([])
  const [activeCat, setActiveCat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const cs = await fetch(`${API}/api/menu/categories`).then(r => r.json())
        setCategories(cs)
        if (cs.length) setActiveCat(cs[0].id)
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeCat) return
    const loadDishes = async () => {
      setLoading(true)
      try {
        const ds = await fetch(`${API}/api/menu/dishes?category_id=${activeCat}`).then(r => r.json())
        setDishes(ds)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    loadDishes()
  }, [activeCat])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <aside className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
        <h3 className="text-white font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition ${activeCat === c.id ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-600/20'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </aside>

      <section>
        <h3 className="text-white font-semibold mb-3">Dishes</h3>
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map(d => (
              <div key={d.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{d.name}</h4>
                  <span className="text-blue-300 text-sm">${Number(d.price).toFixed(2)}</span>
                </div>
                <p className="text-blue-200/80 text-sm line-clamp-2 mb-3">{d.description || '—'}</p>
                <button
                  onClick={() => onAdd(d)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md px-3 py-2 text-sm"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
