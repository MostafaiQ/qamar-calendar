import { useState, useCallback, useEffect, useRef } from 'react'
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
  const detailRef = useRef(null)
  const [adjustment, setAdjustment] = useState(() =>
    parseInt(localStorage.getItem('hijriAdjustment') || '0')
  )
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

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

  // Swipe handling for month navigation
  const touchStart = useRef(null)
  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback((e) => {
    if (touchStart.current === null) return
    const diff = e.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(diff) < 60) return
    // RTL: swipe left = next, swipe right = prev
    const isRtl = document.documentElement.dir === 'rtl'
    if ((diff > 0 && !isRtl) || (diff < 0 && isRtl)) {
      // prev month
      setSelectedDay(null)
      if (currentMonth === 1) { setViewYear(currentYear - 1); setViewMonth(12) }
      else { setViewYear(currentYear); setViewMonth(currentMonth - 1) }
    } else {
      // next month
      setSelectedDay(null)
      if (currentMonth === 12) { setViewYear(currentYear + 1); setViewMonth(1) }
      else { setViewYear(currentYear); setViewMonth(currentMonth + 1) }
    }
  }, [currentYear, currentMonth])

  const handleDayClick = useCallback((day) => {
    setSelectedDay(day.hijriDay)
    setSelectedGregorian(day.gregorianDate)
    // Scroll to detail on mobile
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  const handlePrevMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 1) { setViewYear(currentYear - 1); setViewMonth(12) }
    else { setViewYear(currentYear); setViewMonth(currentMonth - 1) }
  }, [currentYear, currentMonth])

  const handleNextMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 12) { setViewYear(currentYear + 1); setViewMonth(1) }
    else { setViewYear(currentYear); setViewMonth(currentMonth + 1) }
  }, [currentYear, currentMonth])

  const handleToday = useCallback(() => {
    setSelectedDay(null)
    setSelectedGregorian(refDate)
    setViewYear(null)
    setViewMonth(null)
  }, [refDate])

  const isToday = !viewYear && !viewMonth && !selectedDay

  const handleAdjustmentChange = useCallback((newVal) => {
    setAdjustment(newVal)
    localStorage.setItem('hijriAdjustment', String(newVal))
    setSelectedDay(null)
    setViewYear(null)
    setViewMonth(null)
  }, [])

  const selectedHijri = selectedDay ? { year: currentYear, month: currentMonth, day: selectedDay } : hijri

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile: sticky header */}
      <div className="sticky top-0 z-30 lg:relative">
        <Header darkMode={darkMode} onToggleDark={toggleDark} />
      </div>

      <div className="max-w-5xl mx-auto lg:flex lg:gap-6 lg:p-6">
        {/* Calendar side */}
        <div className="lg:w-[380px] lg:flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200 dark:lg:border-gray-700">
            <MonthNav
              hijriYear={currentYear}
              hijriMonth={currentMonth}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
              onToday={handleToday}
              isToday={isToday}
            />
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
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
        </div>

        {/* Detail side */}
        <div className="flex-1 lg:min-w-0" ref={detailRef}>
          <div className="bg-white dark:bg-gray-800 mt-2 mx-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:mt-0 lg:mx-0">
            <DayDetail
              hijri={selectedHijri}
              gregorianDate={selectedDay ? selectedGregorian : refDate}
            />
          </div>

          <div className="mx-2 lg:mx-0">
            <AdjustmentControl value={adjustment} onChange={handleAdjustmentChange} />
          </div>

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
