import { useState, useEffect, useMemo } from 'react'
import { toHijri } from 'hijri-converter'

let overridesCache = null
let overridesLoading = null

function loadOverrides() {
  if (overridesCache) return Promise.resolve(overridesCache)
  if (!overridesLoading) {
    overridesLoading = fetch(import.meta.env.BASE_URL + 'overrides/month-starts.json')
      .then(r => r.ok ? r.json() : {})
      .then(data => { overridesCache = data; return data })
      .catch(() => { overridesCache = {}; return {} })
  }
  return overridesLoading
}

// Start loading immediately
loadOverrides()

function resolveFromOverrides(date, overrides, adjustment) {
  if (!overrides) return null
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  // Check all years and months, find the latest override that is <= date
  let bestMatch = null
  for (const [yearStr, months] of Object.entries(overrides)) {
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
              gregorianStart: info.gregorianStart,
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
  // Start with library fallback for instant render
  const [hijri, setHijri] = useState(() => resolveFromLibrary(gregorianDate, adjustment))

  useEffect(() => {
    // Try overrides for more accurate Shia date
    loadOverrides().then(overrides => {
      const fromOverrides = resolveFromOverrides(gregorianDate, overrides, adjustment)
      if (fromOverrides) {
        setHijri(fromOverrides)
      } else {
        setHijri(resolveFromLibrary(gregorianDate, adjustment))
      }
    })
  }, [gregorianDate.getTime(), adjustment])

  return { hijri }
}
