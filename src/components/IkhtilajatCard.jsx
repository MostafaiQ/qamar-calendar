import { useState, useMemo } from 'react'
import { useLocale } from '../i18n/useLocale.jsx'
import ikhtilajat from '../data/ikhtilajat.js'

function normalizeArabic(str = '') {
  return str
    .trim()
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g, '')
    .replace(/[أإآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function classifySentiment(text) {
  const pos = (text.match(/(خير|سرور|رزق|فرح|رفعة|ظفر|بركة|صحة)/g) || []).length
  const neg = (text.match(/(هم|حزن|شر|تعب|وجع|مرض|مضرة|خصومة)/g) || []).length
  if (pos > neg) return 'positive'
  if (neg > pos) return 'negative'
  return 'neutral'
}

const sentimentStyles = {
  positive: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
    emoji: '✅',
  },
  negative: {
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-800 dark:text-rose-300',
    emoji: '⚠️',
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-800 dark:text-gray-300',
    emoji: 'ℹ️',
  },
}

export default function IkhtilajatCard() {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)

  const results = useMemo(() => {
    const q = normalizeArabic(query)
    if (!q || q.length < 2) return []

    return ikhtilajat
      .map(item => {
        const keyNorm = normalizeArabic(item.key)
        const synNorms = item.synonyms.map(s => normalizeArabic(s))
        const allTerms = [keyNorm, ...synNorms]

        let score = 0
        for (const term of allTerms) {
          if (term === q) { score = 100; break }
          if (term.includes(q)) score = Math.max(score, 80)
          if (q.includes(term)) score = Math.max(score, 60)
        }
        return { ...item, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }, [query])

  return (
    <div className="bg-teal-50 dark:bg-teal-950 rounded-xl border border-teal-100 dark:border-teal-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-teal-800 dark:text-teal-300 font-arabic"
      >
        <span>{t('ikhtilajatTitle')}</span>
        <span className="text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('ikhtilajatPlaceholder')}
            className="w-full rounded-lg border border-teal-200 dark:border-teal-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 font-arabic text-gray-800 dark:text-gray-200"
            dir="rtl"
          />

          {results.map((item, i) => {
            const sentiment = classifySentiment(item.meaning)
            const style = sentimentStyles[sentiment]
            return (
              <div key={i} className={`rounded-lg p-3 border ${style.bg} ${style.border}`}>
                <div className={`text-sm font-semibold mb-1 ${style.text} font-arabic`}>
                  {style.emoji} {item.key}
                </div>
                <p className={`text-sm leading-relaxed font-arabic ${style.text}`}>
                  {item.meaning}
                </p>
              </div>
            )
          })}

          {query && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-teal-600 dark:text-teal-400 font-arabic text-center">
              {t('noResults')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
