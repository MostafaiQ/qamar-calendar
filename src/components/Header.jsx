import { useLocale } from '../i18n/useLocale.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Header() {
  const { t } = useLocale()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800 font-arabic">{t('appTitle')}</h1>
      <LanguageToggle />
    </header>
  )
}
