import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axiosInstance'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const DISPLAY = {
  FOOD: 'Food', TRAVEL: 'Travel', RENT: 'Rent',
  SHOPPING: 'Shopping', UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment', OTHER: 'Other'
}

const PIE_COLORS = ['#3b82f6','#10b981','#ef4444','#f59e0b','#f97316','#ec4899','#8b5cf6']

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Total this month
  const now = new Date()
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.expenseDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  // Category breakdown for pie chart
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
    return acc
  }, {})
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: DISPLAY[name] || name, value
  }))

  // Top category
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]?.name || '—'

  // Monthly bar chart data
  const monthlyTotals = expenses.reduce((acc, e) => {
    const month = new Date(e.expenseDate).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + parseFloat(e.amount)
    return acc
  }, {})
  const monthlyData = Object.entries(monthlyTotals).map(([month, amount]) => ({ month, amount }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Your spending overview</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Total This Month</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">
              ₹{totalThisMonth.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Top Category</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">{topCategory}</p>
            <p className="text-xs text-gray-400 mt-1">Highest spend overall</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-3xl font-bold mt-1 text-violet-600">{expenses.length}</p>
            <p className="text-xs text-gray-400 mt-1">Transactions recorded</p>
          </div>
        </div>

        {/* Charts */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            No expenses yet. Add some from the Expenses page!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Monthly Spending</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`₹${v}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`₹${v}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}