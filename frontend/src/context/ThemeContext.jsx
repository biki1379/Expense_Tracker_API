import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

// Reusable theme classes used across all pages
export function useThemeClasses() {
  const { isDark } = useTheme()
  return {
    page:        isDark ? 'text-slate-100'           : 'text-gray-900',
    card:        isDark ? 'bg-slate-800 border-slate-700'  : 'bg-white border-gray-200',
    cardText:    isDark ? 'text-slate-100'           : 'text-gray-800',
    subText:     isDark ? 'text-slate-400'           : 'text-gray-500',
    mutedText:   isDark ? 'text-slate-500'           : 'text-gray-400',
    input:       isDark
      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    modal:       isDark ? 'bg-slate-800 border-slate-700'  : 'bg-white border-gray-200',
    label:       isDark ? 'text-slate-300'           : 'text-gray-700',
    tableHead:   isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500',
    tableRow:    isDark
      ? 'divide-slate-700/50 hover:bg-slate-700/30'
      : 'divide-gray-100 hover:bg-gray-50',
    filterActive: 'bg-blue-600 text-white',
    filterIdle:  isDark
      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-blue-500 hover:text-slate-200'
      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-gray-900',
    cancelBtn:   isDark
      ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
      : 'border-gray-300 text-gray-600 hover:bg-gray-50',
    errorBox:    isDark
      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
      : 'bg-red-50 border border-red-200 text-red-600',
  }
}