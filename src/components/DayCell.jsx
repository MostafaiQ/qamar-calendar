const overallColors = {
  good: 'bg-emerald-500',
  bad: 'bg-rose-500',
  mixed: 'bg-amber-400',
  neutral: 'bg-gray-300 dark:bg-gray-600',
}

const overallBg = {
  good: 'bg-emerald-50 dark:bg-emerald-950/40',
  bad: 'bg-rose-50 dark:bg-rose-950/40',
  mixed: 'bg-amber-50 dark:bg-amber-950/40',
  neutral: '',
}

export default function DayCell({ day, isSelected, isToday, onClick }) {
  const dotColor = overallColors[day.consensus.overall] || 'bg-gray-300'
  const cellBg = overallBg[day.consensus.overall] || ''
  const gDay = day.gregorianDate.getDate()

  return (
    <button
      onClick={() => onClick(day)}
      className={`
        aspect-square flex flex-col items-center justify-center rounded-xl
        transition-all duration-150 active:scale-95 select-none gap-0.5
        ${isSelected
          ? 'bg-blue-500 dark:bg-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900'
          : isToday
            ? 'ring-2 ring-blue-400 dark:ring-blue-500 ' + cellBg
            : cellBg + ' hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      <span className={`text-[15px] font-bold leading-none
        ${isSelected
          ? 'text-white'
          : isToday
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {day.hijriDay}
      </span>
      <span className={`text-[9px] leading-none
        ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}
      >
        {gDay}
      </span>
      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : dotColor}`} />
    </button>
  )
}
