import { useLocale } from '../i18n/useLocale.jsx'

export default function ReadingCard({ reading }) {
  const { lang, t } = useLocale()

  if (!reading) return null

  const text = lang === 'ar' ? reading.ar : reading.en

  return (
    <div className="bg-sky-50 dark:bg-sky-950 rounded-xl p-4 border border-sky-100 dark:border-sky-800">
      <h3 className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-2 font-arabic">
        {t('reading')}
      </h3>
      <p className="text-sm text-sky-900 dark:text-sky-200 leading-relaxed font-arabic">
        {text}
      </p>
    </div>
  )
}
