import { useLocale } from '../i18n/useLocale.jsx'
import months from '../data/monthNames.js'

export default function MonthNav({ hijriYear, hijriMonth, onPrev, onNext, onToday, isToday }) {
  const { lang } = useLocale()
  const monthData = months.find(m => m.num === hijriMonth) || months[0]
  const monthName = lang === 'ar' ? `شهر ${monthData.ar}` : monthData.en

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800">
      <button
        onClick={onPrev}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors active:scale-90 text-lg"
        aria-label="Previous month"
      >
        {lang === 'ar' ? '›' : '‹'}
      </button>
      <div className="text-center">
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 font-arabic">
          {monthName}
        </h2>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">{hijriYear} هـ</p>
        {!isToday && (
          <button
            onClick={onToday}
            className="mt-1 px-3 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-arabic"
          >
            {lang === 'ar' ? 'اليوم' : 'Today'}
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors active:scale-90 text-lg"
        aria-label="Next month"
      >
        {lang === 'ar' ? '‹' : '›'}
      </button>
    </div>
  )
}
