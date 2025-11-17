import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const active = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-900/70 border-b border-slate-700/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Blue Bites</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md text-sm ${active('/') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-600/30'}`}
          >
            Order
          </Link>
          <Link
            to="/kitchen"
            className={`px-3 py-1.5 rounded-md text-sm ${active('/kitchen') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-600/30'}`}
          >
            Kitchen
          </Link>
          <a
            href="/test"
            className={`px-3 py-1.5 rounded-md text-sm ${active('/test') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-600/30'}`}
          >
            Status
          </a>
        </nav>
      </div>
    </header>
  )
}
