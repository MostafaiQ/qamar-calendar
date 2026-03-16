import { useLocale } from '../i18n/useLocale.jsx'
import months from '../data/monthNames.js'

export default function MonthNav({ hijriYear, hijriMonth, onPrev, onNext }) {
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
