import { useLocale } from '../i18n/useLocale.jsx'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLocale()

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
      aria-label="Toggle language"
    >
      {lang === 'ar' ? 'EN' : 'عربي'}
    </button>
  )
}
