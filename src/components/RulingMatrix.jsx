import { useLocale } from '../i18n/useLocale.jsx'

const rulingStyle = {
  'حسن': { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'مكروه': { bg: 'bg-rose-50 dark:bg-rose-950', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  'مباح': { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' },
}

const categories = ['marriage', 'travel', 'building', 'work']

export default function RulingMatrix({ consensus }) {
  const { t } = useLocale()

  if (!consensus) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 font-arabic">
        {t('rulings')}
      </h3>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {categories.map(cat => {
          const ruling = consensus[cat]
          const style = rulingStyle[ruling] || rulingStyle['مباح']
          return (
            <div key={cat} className={`flex items-center justify-between px-4 py-2.5 ${style.bg}`}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic">{t(cat)}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                <span className={`text-sm font-medium ${style.text} font-arabic`}>
                  {t(ruling === 'حسن' ? 'good' : ruling === 'مكروه' ? 'disliked' : 'neutral')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
