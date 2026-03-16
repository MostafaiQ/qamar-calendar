import { useLocale } from '../i18n/useLocale.jsx'

export default function ReadingCard({ reading }) {
  const { lang, t } = useLocale()

  if (!reading) return null

  const text = lang === 'ar' ? reading.ar : reading.en

  return (
    <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
      <h3 className="text-sm font-semibold text-sky-800 mb-2 font-arabic">
        {t('reading')}
      </h3>
      <p className="text-sm text-sky-900 leading-relaxed font-arabic">
        {text}
      </p>
    </div>
  )
}
