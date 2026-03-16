import { useLocale } from '../i18n/useLocale.jsx'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLocale()

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'ar' ? 'EN' : 'عربي'}
    </button>
  )
}
