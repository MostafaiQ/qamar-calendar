const overallColors = {
  good: 'bg-emerald-500',
  bad: 'bg-rose-500',
  mixed: 'bg-amber-500',
  neutral: 'bg-gray-400 dark:bg-gray-500',
}

export default function DayCell({ day, isSelected, isToday, onClick }) {
  const dotColor = overallColors[day.consensus.overall] || 'bg-gray-400'

  return (
    <button
      onClick={() => onClick(day)}
      className={`
        relative flex flex-col items-center justify-center p-1 rounded-lg transition-all min-h-[44px]
        ${isSelected
          ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
        ${isToday ? 'font-bold' : ''}
      `}
    >
      <span className={`text-sm ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
        {day.hijriDay}
      </span>
      <span className={`w-2 h-2 rounded-full mt-0.5 ${dotColor}`} />
    </button>
  )
}
