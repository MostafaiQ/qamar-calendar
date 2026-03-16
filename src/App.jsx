import { useState, useCallback } from 'react'
import { LocaleProvider, useLocale } from './i18n/useLocale.jsx'
import { useHijriDate } from './hooks/useHijriDate.js'
import { useCalendarMonth } from './hooks/useCalendarMonth.js'
import { addDays } from './utils/dateHelpers.js'
import Header from './components/Header.jsx'
import MonthNav from './components/MonthNav.jsx'
import CalendarGrid from './components/CalendarGrid.jsx'
import DayDetail from './components/DayDetail.jsx'
import AdjustmentControl from './components/AdjustmentControl.jsx'

function AppContent() {
  const { t } = useLocale()
  const [refDate] = useState(() => new Date())
  const { hijri, loading: hijriLoading } = useHijriDate(refDate)

  const [viewYear, setViewYear] = useState(null)
  const [viewMonth, setViewMonth] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedGregorian, setSelectedGregorian] = useState(refDate)

  // Initialize view from resolved hijri date
  const currentYear = viewYear || hijri?.year || 1447
  const currentMonth = viewMonth || hijri?.month || 1

  const { days, loading: monthLoading } = useCalendarMonth(currentYear, currentMonth)

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

  const handleAdjustmentChange = useCallback(() => {
    window.location.reload()
  }, [])

  // Selected day's hijri object for detail view
  const selectedHijri = selectedDay ? { year: currentYear, month: currentMonth, day: selectedDay } : hijri

  if (hijriLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg font-arabic">...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto lg:flex lg:gap-6 lg:p-6">
        {/* Calendar side */}
        <div className="lg:w-[360px] lg:flex-shrink-0">
          <div className="bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200">
            <Header />
            <MonthNav
              hijriYear={currentYear}
              hijriMonth={currentMonth}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
            />
            {monthLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400 font-arabic">...</div>
              </div>
            ) : (
              <CalendarGrid
                days={days}
                selectedDay={selectedDay || hijri?.day}
                todayHijriDay={hijri?.day}
                onDayClick={handleDayClick}
              />
            )}
          </div>
        </div>

        {/* Detail side */}
        <div className="flex-1 lg:min-w-0">
          <div className="bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200">
            <DayDetail
              hijri={selectedHijri}
              gregorianDate={selectedDay ? selectedGregorian : refDate}
            />
          </div>

          <AdjustmentControl onAdjustmentChange={handleAdjustmentChange} />

          <p className="text-center text-xs text-gray-400 py-4 px-4 font-arabic">
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
