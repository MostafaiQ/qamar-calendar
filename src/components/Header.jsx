import { useLocale } from '../i18n/useLocale.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Header({ darkMode, onToggleDark }) {
  const { t } = useLocale()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-arabic">{t('appTitle')}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <LanguageToggle />
      </div>
    </header>
  )
}
