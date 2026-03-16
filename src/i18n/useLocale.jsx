import { createContext, useContext, useState, useCallback } from 'react'
import ar from './ar.json'
import en from './en.json'

const strings = { ar, en }

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState('ar')

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar'
      document.documentElement.lang = next
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
      return next
    })
  }, [])

  const t = useCallback((key) => {
    return strings[lang]?.[key] || strings.ar[key] || key
  }, [lang])

  return (
    <LocaleContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
