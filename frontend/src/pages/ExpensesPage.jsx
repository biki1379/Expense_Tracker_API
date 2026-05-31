import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axiosInstance'

const CATEGORIES = ['FOOD', 'TRAVEL', 'RENT', 'SHOPPING', 'UTILITIES', 'ENTERTAINMENT', 'OTHER']

const DISPLAY = {
  FOOD: 'Food', TRAVEL: 'Travel', RENT: 'Rent',
  SHOPPING: 'Shopping', UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment', OTHER: 'Other'
}

const COLORS = {
  FOOD:          'bg-blue-100 text-blue-700',
  TRAVEL:        'bg-emerald-100 text-emerald-700',
  RENT:          'bg-red-100 text-red-700',
  SHOPPING:      'bg-amber-100 text-amber-700',
  UTILITIES:     'bg-orange-100 text-orange-700',
  ENTERTAINMENT: 'bg-pink-100 text-pink-700',
  OTHER:         'bg-violet-100 text-violet-700',
}

function ExpenseModal({ expense, onClose, onSave }) {
  const [form, setForm] = useState(
    expense || { description: '', amount: '', category: 'FOOD', expenseDate: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {expense ? 'Edit Expense' : 'Add Expense'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleChange} required
              placeholder="What did you spend on?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Amount (₹)</label>
              <input name="amount" type="number" min="0.01" step="0.01"
                value={form.amount} onChange={handleChange} required placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
              <input name="expenseDate" type="date" value={form.expenseDate}
                onChange={handleChange} required
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{DISPLAY[c]}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg
                         text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5
                         rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ExpensesPage() {
  const [expenses, setExpenses]      = useState([])
  const [loading, setLoading]        = useState(true)
  const [filterCategory, setFilter]  = useState('ALL')
  const [showModal, setShowModal]    = useState(false)
  const [editingExpense, setEditing] = useState(null)

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses')
      setExpenses(res.data)
    } catch (err) {
      console.error('Failed to fetch expenses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchExpenses() }, [])

  const filtered = filterCategory === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === filterCategory)

  const handleSave = async (data) => {
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense.id}`, data)
    } else {
      await api.post('/expenses', data)
    }
    await fetchExpenses()
    setShowModal(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await api.delete(`/expenses/${id}`)
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} transactions</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       px-4 py-2.5 rounded-lg transition-colors">
            + Add Expense
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['ALL', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
              }`}>
              {cat === 'ALL' ? 'All' : DISPLAY[cat]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading expenses...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Description</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Amount</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No expenses yet — add your first one!
                    </td>
                  </tr>
                ) : filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-medium">{expense.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${COLORS[expense.category]}`}>
                        {DISPLAY[expense.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{expense.expenseDate}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ₹{parseFloat(expense.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditing(expense); setShowModal(true) }}
                        className="text-blue-500 hover:text-blue-700 font-medium mr-3">Edit</button>
                      <button onClick={() => handleDelete(expense.id)}
                        className="text-red-400 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => { setShowModal(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}