import { useState } from 'react'
import { useLocale } from '../i18n/useLocale.jsx'

export default function AdjustmentControl({ onAdjustmentChange }) {
  const { t } = useLocale()
  const [value, setValue] = useState(() => {
    return parseInt(localStorage.getItem('hijriAdjustment') || '0')
  })

  const update = (newVal) => {
    const clamped = Math.max(-2, Math.min(2, newVal))
    setValue(clamped)
    localStorage.setItem('hijriAdjustment', String(clamped))
    if (onAdjustmentChange) onAdjustmentChange(clamped)
  }

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span className="text-sm text-gray-600 font-arabic">{t('adjustment')}:</span>
      <button
        onClick={() => update(value - 1)}
        disabled={value <= -2}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors text-gray-700 font-bold"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-gray-800">{value}</span>
      <button
        onClick={() => update(value + 1)}
        disabled={value >= 2}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors text-gray-700 font-bold"
      >
        +
      </button>
    </div>
  )
}
