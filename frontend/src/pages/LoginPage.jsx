import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', form)
      const { token, user } = response.data
      login(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Spendly</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage your expenses</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400
                            text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                           text-sm text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                           text-sm text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5
                         rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}