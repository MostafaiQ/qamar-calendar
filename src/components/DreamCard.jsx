import { useLocale } from '../i18n/useLocale.jsx'
import dreamRules from '../data/dreamRules.js'

export default function DreamCard({ hijriDay }) {
  const { lang, t } = useLocale()

  if (!hijriDay) return null
  const rule = dreamRules[hijriDay]
  if (!rule) return null

  const text = lang === 'ar' ? rule.ar : rule.en

  return (
    <div className="bg-purple-50 dark:bg-purple-950 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
      <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2 font-arabic">
        {t('dreamTitle')}
      </h3>
      <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed font-arabic">
        {text}
      </p>
    </div>
  )
}
