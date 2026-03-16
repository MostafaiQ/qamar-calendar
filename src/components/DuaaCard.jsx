import { useLocale } from '../i18n/useLocale.jsx'
import duaa from '../data/duaa.js'

export default function DuaaCard({ show }) {
  const { lang } = useLocale()

  if (!show) return null

  const intro = lang === 'ar' ? duaa.introAr : duaa.introEn
  const text = lang === 'ar' ? duaa.textAr : duaa.textEn
  const closing = lang === 'ar' ? duaa.closingAr : duaa.closingEn
  const charity = lang === 'ar' ? duaa.charityAr : duaa.charityEn
  const title = lang === 'ar' ? duaa.titleAr : duaa.titleEn

  return (
    <div className="bg-rose-50 dark:bg-rose-950 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
      <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-2 font-arabic">
        {title}
      </h3>
      <p className="text-xs text-rose-700 dark:text-rose-400 mb-2 font-arabic">{intro}</p>
      <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-arabic font-semibold mb-2">
        {text}
      </p>
      <p className="text-xs text-rose-700 dark:text-rose-400 mb-3 font-arabic">{closing}</p>
      <div className="border-t border-rose-200 dark:border-rose-700 pt-2">
        <p className="text-xs text-rose-600 dark:text-rose-400 font-arabic">{charity}</p>
      </div>
    </div>
  )
}
