import { useState, useCallback, useEffect } from 'react'
import { LocaleProvider, useLocale } from './i18n/useLocale.jsx'
import { useHijriDate } from './hooks/useHijriDate.js'
import { useCalendarMonth } from './hooks/useCalendarMonth.js'
import Header from './components/Header.jsx'
import MonthNav from './components/MonthNav.jsx'
import CalendarGrid from './components/CalendarGrid.jsx'
import DayDetail from './components/DayDetail.jsx'
import AdjustmentControl from './components/AdjustmentControl.jsx'

function AppContent() {
  const { t } = useLocale()
  const [adjustment, setAdjustment] = useState(() =>
    parseInt(localStorage.getItem('hijriAdjustment') || '0')
  )
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  // Apply dark mode class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const toggleDark = useCallback(() => setDarkMode(prev => !prev), [])

  const [refDate] = useState(() => new Date())
  const { hijri } = useHijriDate(refDate, adjustment)

  const [viewYear, setViewYear] = useState(null)
  const [viewMonth, setViewMonth] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedGregorian, setSelectedGregorian] = useState(refDate)

  const currentYear = viewYear || hijri?.year || 1447
  const currentMonth = viewMonth || hijri?.month || 1

  const { days } = useCalendarMonth(currentYear, currentMonth, adjustment)

  const handleDayClick = useCallback((day) => {
    setSelectedDay(day.hijriDay)
    setSelectedGregorian(day.gregorianDate)
  }, [])

  const handlePrevMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 1) {
      setViewYear(currentYear - 1)
      setViewMonth(12)
    } else {
      setViewYear(currentYear)
      setViewMonth(currentMonth - 1)
    }
  }, [currentYear, currentMonth])

  const handleNextMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 12) {
      setViewYear(currentYear + 1)
      setViewMonth(1)
    } else {
      setViewYear(currentYear)
      setViewMonth(currentMonth + 1)
    }
  }, [currentYear, currentMonth])

  const handleAdjustmentChange = useCallback((newVal) => {
    setAdjustment(newVal)
    localStorage.setItem('hijriAdjustment', String(newVal))
    // Reset selection so it picks up the new date
    setSelectedDay(null)
    setViewYear(null)
    setViewMonth(null)
  }, [])

  const selectedHijri = selectedDay ? { year: currentYear, month: currentMonth, day: selectedDay } : hijri

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto lg:flex lg:gap-6 lg:p-6">
        {/* Calendar side */}
        <div className="lg:w-[360px] lg:flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200 dark:lg:border-gray-700">
            <Header darkMode={darkMode} onToggleDark={toggleDark} />
            <MonthNav
              hijriYear={currentYear}
              hijriMonth={currentMonth}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
            />
            <CalendarGrid
              days={days}
              selectedDay={selectedDay || hijri?.day}
              todayHijriDay={hijri?.day}
              currentMonth={currentMonth}
              todayMonth={hijri?.month}
              onDayClick={handleDayClick}
            />
          </div>
        </div>

        {/* Detail side */}
        <div className="flex-1 lg:min-w-0">
          <div className="bg-white dark:bg-gray-800 lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200 dark:lg:border-gray-700">
            <DayDetail
              hijri={selectedHijri}
              gregorianDate={selectedDay ? selectedGregorian : refDate}
            />
          </div>

          <AdjustmentControl value={adjustment} onChange={handleAdjustmentChange} />

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 px-4 font-arabic">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  )
}
