import { useMemo } from 'react'
import { toHijri } from 'hijri-converter'
import monthStarts from '../data/monthStarts.js'

function resolveFromOverrides(date, adjustment) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  let bestMatch = null
  for (const [yearStr, months] of Object.entries(monthStarts)) {
    for (const [monthStr, info] of Object.entries(months)) {
      if (dateStr >= info.gregorianStart) {
        const start = new Date(info.gregorianStart + 'T00:00:00')
        const diffDays = Math.round((date - start) / (1000 * 60 * 60 * 24))
        const hijriDay = diffDays + 1 + adjustment
        if (hijriDay >= 1 && hijriDay <= 30) {
          if (!bestMatch || info.gregorianStart > bestMatch.gregorianStart) {
            bestMatch = {
              year: parseInt(yearStr),
              month: parseInt(monthStr),
              day: hijriDay,
            }
          }
        }
      }
    }
  }
  return bestMatch
}

function resolveFromLibrary(date, adjustment) {
  try {
    const { hy, hm, hd } = toHijri(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    )
    let day = hd + adjustment
    let month = hm
    let year = hy
    if (day < 1) { month--; day += 30 }
    if (day > 30) { month++; day -= 30 }
    if (month < 1) { year--; month = 12 }
    if (month > 12) { year++; month = 1 }
    return { year, month, day }
  } catch (e) {
    return { year: 1447, month: 1, day: 1 }
  }
}

export function useHijriDate(gregorianDate, adjustment = 0) {
  const hijri = useMemo(() => {
    // Try Shia overrides first (synchronous, instant)
    const fromOverrides = resolveFromOverrides(gregorianDate, adjustment)
    if (fromOverrides) return fromOverrides
    // Fallback to hijri-converter (Umm al-Qura)
    return resolveFromLibrary(gregorianDate, adjustment)
  }, [gregorianDate.getTime(), adjustment])

  return { hijri }
}
