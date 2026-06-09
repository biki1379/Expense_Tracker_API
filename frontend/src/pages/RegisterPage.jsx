import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/register', form)
      const { token, user } = response.data
      login(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Spendly</h1>
          <p className="text-slate-400 text-sm mt-2">Create your account</p>
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
              <label className="text-sm font-medium text-slate-300 block mb-1.5">
                Full Name
              </label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} required placeholder="Biki Saha"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg
                           px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">
                Email
              </label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg
                           px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg
                             px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-transparent" />
                <button type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-slate-400 hover:text-slate-200 transition-colors">
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'} text-base`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium
                         py-2.5 rounded-lg text-sm transition-colors
                         disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}