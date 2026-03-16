import { useLocale } from '../i18n/useLocale.jsx'

export default function AdjustmentControl({ value, onChange }) {
  const { t } = useLocale()

  const update = (newVal) => {
    const clamped = Math.max(-2, Math.min(2, newVal))
    onChange(clamped)
  }

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-arabic">{t('adjustment')}:</span>
      <button
        onClick={() => update(value - 1)}
        disabled={value <= -2}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 transition-colors text-gray-700 dark:text-gray-300 font-bold"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-gray-800 dark:text-gray-200">{value}</span>
      <button
        onClick={() => update(value + 1)}
        disabled={value >= 2}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 transition-colors text-gray-700 dark:text-gray-300 font-bold"
      >
        +
      </button>
    </div>
  )
}
