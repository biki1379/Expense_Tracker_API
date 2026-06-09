import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import { useThemeClasses } from '../context/ThemeContext'

const CATEGORIES = ['FOOD','TRAVEL','RENT','SHOPPING','UTILITIES','ENTERTAINMENT','OTHER']
const DISPLAY = {
  FOOD:'Food', TRAVEL:'Travel', RENT:'Rent', SHOPPING:'Shopping',
  UTILITIES:'Utilities', ENTERTAINMENT:'Entertainment', OTHER:'Other'
}
const COLORS = {
  FOOD:          'bg-blue-500/20 text-blue-500',
  TRAVEL:        'bg-emerald-500/20 text-emerald-500',
  RENT:          'bg-red-500/20 text-red-500',
  SHOPPING:      'bg-amber-500/20 text-amber-500',
  UTILITIES:     'bg-orange-500/20 text-orange-500',
  ENTERTAINMENT: 'bg-pink-500/20 text-pink-500',
  OTHER:         'bg-violet-500/20 text-violet-500',
}

function ExpenseModal({ expense, onClose, onSave }) {
  const tc = useThemeClasses()
  const [form, setForm] = useState(
    expense || { description: '', amount: '', category: 'FOOD', expenseDate: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

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

  const inputClass = `w-full border rounded-lg px-4 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${tc.input}`

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className={`border rounded-2xl shadow-xl w-full max-w-md p-6 ${tc.modal}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${tc.cardText}`}>
            {expense ? 'Edit Expense' : 'Add Expense'}
          </h3>
          <button onClick={onClose} className={`text-xl ${tc.mutedText} hover:${tc.subText}`}>✕</button>
        </div>

        {error && <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${tc.errorBox}`}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={`text-sm font-medium block mb-1.5 ${tc.label}`}>Description</label>
            <input name="description" value={form.description} onChange={handleChange}
              required placeholder="What did you spend on?" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium block mb-1.5 ${tc.label}`}>Amount (₹)</label>
              <input name="amount" type="number" min="0.01" step="0.01"
                value={form.amount} onChange={handleChange} required
                placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={`text-sm font-medium block mb-1.5 ${tc.label}`}>Date</label>
              <input name="expenseDate" type="date" value={form.expenseDate}
                onChange={handleChange} required
                max={new Date().toISOString().split('T')[0]}
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1.5 ${tc.label}`}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{DISPLAY[c]}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className={`flex-1 border py-2.5 rounded-lg text-sm font-medium
                          transition-colors ${tc.cancelBtn}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5
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
  const tc = useThemeClasses()
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
    <div className={tc.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${tc.cardText}`}>Expenses</h2>
          <p className={`text-sm mt-1 ${tc.subText}`}>{filtered.length} transactions</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium
                     px-4 py-2.5 rounded-lg transition-colors">
          + Add Expense
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['ALL', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              filterCategory === cat ? tc.filterActive : tc.filterIdle
            }`}>
            {cat === 'ALL' ? 'All' : DISPLAY[cat]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`border rounded-2xl overflow-hidden ${tc.card}`}>
        {loading ? (
          <div className={`text-center py-16 ${tc.mutedText}`}>Loading expenses...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className={`border-b ${tc.tableHead}`}>
              <tr>
                <th className="text-left px-6 py-3 font-medium">Description</th>
                <th className="text-left px-6 py-3 font-medium">Category</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-right px-6 py-3 font-medium">Amount</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tc.tableRow}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`text-center py-12 ${tc.mutedText}`}>
                    No expenses yet — add your first one!
                  </td>
                </tr>
              ) : filtered.map(expense => (
                <tr key={expense.id} className="transition-colors">
                  <td className={`px-6 py-4 font-medium ${tc.cardText}`}>{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${COLORS[expense.category]}`}>
                      {DISPLAY[expense.category]}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${tc.subText}`}>{expense.expenseDate}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${tc.cardText}`}>
                    ₹{parseFloat(expense.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditing(expense); setShowModal(true) }}
                      className="text-blue-500 hover:text-blue-400 font-medium mr-3">Edit</button>
                    <button onClick={() => handleDelete(expense.id)}
                      className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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