import { useState } from 'react'
import Navbar from '../components/Navbar'

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Other']

// Mock data — replaced with real API later
const MOCK_EXPENSES = [
  { id: 1, description: 'Grocery shopping',   amount: 850,  category: 'Food',     date: '2025-06-10' },
  { id: 2, description: 'Uber to airport',     amount: 620,  category: 'Travel',   date: '2025-06-09' },
  { id: 3, description: 'Amazon order',        amount: 1999, category: 'Shopping', date: '2025-06-08' },
  { id: 4, description: 'Electricity bill',    amount: 1200, category: 'Bills',    date: '2025-06-07' },
  { id: 5, description: 'Restaurant dinner',   amount: 740,  category: 'Food',     date: '2025-06-06' },
  { id: 6, description: 'Pharmacy',            amount: 450,  category: 'Health',   date: '2025-06-05' },
  { id: 7, description: 'Movie tickets',       amount: 600,  category: 'Other',    date: '2025-06-04' },
  { id: 8, description: 'Train ticket',        amount: 380,  category: 'Travel',   date: '2025-06-03' },
]

const CATEGORY_COLORS = {
  Food:     'bg-blue-100 text-blue-700',
  Travel:   'bg-emerald-100 text-emerald-700',
  Shopping: 'bg-amber-100 text-amber-700',
  Bills:    'bg-red-100 text-red-700',
  Health:   'bg-pink-100 text-pink-700',
  Other:    'bg-violet-100 text-violet-700',
}

// ── Add/Edit Modal ──────────────────────────────────────────
function ExpenseModal({ expense, onClose, onSave }) {
  const [form, setForm] = useState(
    expense || { description: '', amount: '', category: 'Food', date: '' }
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, amount: parseFloat(form.amount) })
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="What did you spend on?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Amount (₹)</label>
              <input
                name="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg
                         text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5
                         rounded-lg text-sm font-medium transition-colors"
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────
export default function ExpensesPage() {
  const [expenses, setExpenses]       = useState(MOCK_EXPENSES)
  const [filterCategory, setFilter]   = useState('All')
  const [showModal, setShowModal]     = useState(false)
  const [editingExpense, setEditing]  = useState(null)

  // Filter by category
  const filtered = filterCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === filterCategory)

  const handleSave = (data) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...data, id: e.id } : e))
    } else {
      setExpenses([{ ...data, id: Date.now() }, ...expenses])
    }
    setShowModal(false)
    setEditing(null)
  }

  const handleEdit = (expense) => {
    setEditing(expense)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const handleAdd = () => {
    setEditing(null)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} transactions</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       px-4 py-2.5 rounded-lg transition-colors"
          >
            + Add Expense
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    No expenses found
                  </td>
                </tr>
              ) : (
                filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-medium">{expense.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category]}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{expense.date}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-500 hover:text-blue-700 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-400 hover:text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
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