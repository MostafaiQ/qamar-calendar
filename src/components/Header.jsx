import { useLocale } from '../i18n/useLocale.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Header({ darkMode, onToggleDark }) {
  const { t } = useLocale()

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:border-b-0 lg:rounded-t-xl">
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 font-arabic">{t('appTitle')}</h1>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-90"
          aria-label="Toggle dark mode"
        >
          <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
        </button>
        <LanguageToggle />
      </div>
    </header>
  )
}
