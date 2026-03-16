import { useLocale } from '../i18n/useLocale.jsx'
import { getWeekdayShort } from '../utils/dateHelpers.js'
import DayCell from './DayCell.jsx'

export default function CalendarGrid({ days, selectedDay, todayHijriDay, currentMonth, todayMonth, onDayClick }) {
  const { lang } = useLocale()

  const headers = Array.from({ length: 7 }, (_, i) => getWeekdayShort(i, lang))
  const firstDayWeekday = days.length > 0 ? days[0].weekdayIndex : 0

  return (
    <div className="px-3 pb-3">
      {/* Weekday header row */}
      <div className="grid grid-cols-7 mb-1">
        {headers.map((name, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 py-2 font-arabic uppercase">
            {name}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-[3px]">
        {/* Empty leading cells */}
        {Array.from({ length: firstDayWeekday }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => (
          <DayCell
            key={day.hijriDay}
            day={day}
            isSelected={selectedDay === day.hijriDay}
            isToday={todayHijriDay === day.hijriDay && currentMonth === todayMonth}
            onClick={onDayClick}
          />
        ))}
      </div>
    </div>
  )
}
