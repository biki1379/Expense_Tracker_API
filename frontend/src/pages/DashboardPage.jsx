import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import { useThemeClasses } from '../context/ThemeContext'
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
  const tc = useThemeClasses()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const now     = new Date()
  const today   = now.toISOString().split('T')[0]

  const todayTotal = expenses
    .filter(e => e.expenseDate === today)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const thisMonthTotal = expenses
    .filter(e => {
      const d = new Date(e.expenseDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const allTimeTotal = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
    return acc
  }, {})
  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name: DISPLAY[name] || name, value }))
    .sort((a, b) => b.value - a.value)

  const topCategory = categoryData[0]?.name || '—'

  const monthlyTotals = expenses.reduce((acc, e) => {
    const month = new Date(e.expenseDate).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + parseFloat(e.amount)
    return acc
  }, {})
  const monthlyData = Object.entries(monthlyTotals)
    .map(([month, amount]) => ({ month, amount }))

  const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9'
  }

  if (loading) return (
    <div className={`flex items-center justify-center h-64 ${tc.mutedText}`}>
      Loading dashboard...
    </div>
  )

  return (
    <div className={tc.page}>
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${tc.cardText}`}>Dashboard</h2>
        <p className={`text-sm mt-1 ${tc.subText}`}>Your spending overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Expenses",  value: `₹${todayTotal.toLocaleString()}`,    sub: now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }), color: 'text-orange-500' },
          { label: 'Total This Month',  value: `₹${thisMonthTotal.toLocaleString()}`, sub: now.toLocaleString('default', { month: 'long', year: 'numeric' }),                   color: 'text-blue-500'   },
          { label: 'All Time Total',    value: `₹${allTimeTotal.toLocaleString()}`,   sub: 'Since you started',                                                                  color: 'text-violet-500' },
          { label: 'Top Category',      value: topCategory,                            sub: 'Highest spend overall',                                                              color: 'text-emerald-500'},
        ].map(card => (
          <div key={card.label} className={`border rounded-2xl p-6 ${tc.card}`}>
            <p className={`text-sm ${tc.subText}`}>{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            <p className={`text-xs mt-1 ${tc.mutedText}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {expenses.length === 0 ? (
        <div className={`border rounded-2xl p-12 text-center ${tc.card} ${tc.mutedText}`}>
          No expenses yet — add some from the Expenses page!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-6 ${tc.card}`}>
            <h3 className={`text-base font-semibold mb-4 ${tc.cardText}`}>Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`border rounded-2xl p-6 ${tc.card}`}>
            <h3 className={`text-base font-semibold mb-4 ${tc.cardText}`}>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v}`, 'Amount']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}