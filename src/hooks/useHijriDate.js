import { useState, useEffect } from 'react'
import { resolveHijriDate } from '../engine/hijriResolver.js'

/**
 * Resolve today's Shia Hijri date.
 * Priority: confirmed overrides → AlAdhan API → hijri-converter fallback.
 * No Sunni chaining.
 */
export function useHijriDate(gregorianDate, adjustment = 0) {
  const [hijri, setHijri] = useState(null)

  useEffect(() => {
    let cancelled = false

    const dateMidnight = new Date(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    )

    resolveHijriDate(dateMidnight).then(result => {
      if (cancelled) return

      let { year, month, day } = result
      day += adjustment
      if (day < 1) { month--; day += 30 }
      if (day > 30) { month++; day -= 30 }
      if (month < 1) { year--; month = 12 }
      if (month > 12) { year++; month = 1 }

      setHijri({ year, month, day, source: result.source })
    })

    return () => { cancelled = true }
  }, [gregorianDate.getTime(), adjustment])

  return { hijri }
}
