import { useLocale } from '../i18n/useLocale.jsx'
import months from '../data/monthNames.js'

export default function MonthNav({ hijriYear, hijriMonth, onPrev, onNext }) {
  const { lang } = useLocale()
  const monthData = months.find(m => m.num === hijriMonth) || months[0]
  const monthName = lang === 'ar' ? `شهر ${monthData.ar}` : monthData.en

  return (
    <div className="flex items-center justify-center gap-4 py-3 bg-white dark:bg-gray-800">
      <button
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        aria-label="Previous month"
      >
        {lang === 'ar' ? '→' : '←'}
      </button>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-arabic min-w-[200px] text-center">
        {monthName} {hijriYear}
      </h2>
      <button
        onClick={onNext}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        aria-label="Next month"
      >
        {lang === 'ar' ? '←' : '→'}
      </button>
    </div>
  )
}
