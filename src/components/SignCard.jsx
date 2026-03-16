import { useLocale } from '../i18n/useLocale.jsx'

export default function SignCard({ sign, nightDuration, positionInSign }) {
  const { lang, t } = useLocale()

  if (!sign) return null

  const signName = lang === 'ar' ? sign.ar : sign.en

  return (
    <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{sign.emoji}</span>
        <div>
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 font-arabic">
            {t('moonIn')} {signName}
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400 font-arabic">
            {t('night')} {positionInSign} {t('of')} {nightDuration}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 mt-3 justify-center">
        {Array.from({ length: nightDuration }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < positionInSign ? 'bg-indigo-500' : 'bg-indigo-200 dark:bg-indigo-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
