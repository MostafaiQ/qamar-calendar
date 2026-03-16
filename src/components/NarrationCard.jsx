import { useLocale } from '../i18n/useLocale.jsx'

export default function NarrationCard({ narration }) {
  const { lang, t } = useLocale()

  if (!narration) return null

  const story = lang === 'ar' ? narration.storyAr : narration.storyEn

  return (
    <div className="bg-amber-50 dark:bg-amber-950 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
      <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 font-arabic">
        {t('narration')}
      </h3>
      <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-arabic">
        {story}
      </p>
      {narration.source && (
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 font-arabic">
          {t('source')}: {narration.source}
        </p>
      )}
    </div>
  )
}
