import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">

      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        Spendly
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className={`text-sm font-medium transition-colors ${
            isActive('/dashboard')
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/expenses"
          className={`text-sm font-medium transition-colors ${
            isActive('/expenses')
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Expenses
        </Link>
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hi, <span className="font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}