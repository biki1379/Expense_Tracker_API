import { useState } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { path: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { path: '/expenses',  icon: 'ti-receipt',           label: 'Expenses'  },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const t = {
    bg:       isDark ? 'bg-slate-900'  : 'bg-gray-50',
    sidebar:  isDark ? 'bg-slate-950'  : 'bg-white',
    border:   isDark ? 'border-slate-800' : 'border-gray-200',
    navIdle:  isDark
      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
    text:     isDark ? 'text-slate-100' : 'text-gray-900',
    textSub:  isDark ? 'text-slate-500' : 'text-gray-400',
    header:   isDark ? 'bg-slate-900'  : 'bg-white',
    toggleBg: isDark ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                     : 'bg-gray-100 hover:bg-gray-200 text-slate-600',
    hamburger: isDark ? 'text-slate-400 hover:text-slate-100'
                      : 'text-gray-500 hover:text-gray-900',
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`px-6 py-5 border-b ${t.border} flex items-center justify-between`}>
        <div>
          <h1 className="text-xl font-bold text-blue-500">Spendly</h1>
          <p className={`text-xs ${t.textSub} mt-0.5`}>Expense Tracker</p>
        </div>
        {/* Close button — mobile only */}
        <button onClick={() => setSidebarOpen(false)}
          className={`lg:hidden text-xl ${t.hamburger}`}>✕</button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <Link key={item.path} to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                        font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : t.navIdle
            }`}>
            <i className={`ti ${item.icon} text-base`} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className={`px-3 py-4 border-t ${t.border}`}>
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
                          justify-center text-sm font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${t.text}`}>{user?.name}</p>
            <p className={`text-xs truncate ${t.textSub}`}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg
                     text-sm font-medium transition-colors
                     ${isDark
                        ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
                        : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'}`}>
          <i className="ti ti-logout text-base" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className={`flex h-screen ${t.bg} overflow-hidden`}>

      {/* ── Desktop Sidebar ── */}
      <aside className={`hidden lg:flex w-64 ${t.sidebar} border-r ${t.border}
                         flex-col flex-shrink-0`}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50"
               onClick={() => setSidebarOpen(false)} />
          {/* Sidebar panel */}
          <aside className={`relative w-72 ${t.sidebar} flex flex-col h-full shadow-2xl`}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className={`h-14 border-b ${t.border} px-4 flex items-center
                            justify-between ${t.header} flex-shrink-0`}>
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-1.5 rounded-lg ${t.hamburger}`}>
              <i className="ti ti-menu-2 text-xl" />
            </button>
            <p className={`text-sm font-medium ${t.textSub}`}>
              {navItems.find(n => n.path === location.pathname)?.label}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-sm ${t.textSub} hidden md:block`}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
            {/* Theme toggle */}
            <button onClick={toggle}
              className={`w-9 h-9 rounded-lg flex items-center justify-center
                          transition-colors ${t.toggleBg}`}
              title={isDark ? 'Light mode' : 'Dark mode'}>
              <i className={`ti ${isDark ? 'ti-sun' : 'ti-moon'} text-base`} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}