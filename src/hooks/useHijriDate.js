import { useMemo } from 'react'
import { getMonthStart } from '../data/monthStarts.js'

/**
 * Resolve today's Shia Hijri date.
 * Uses getMonthStart (confirmed sightings or Sunni+1 offset).
 * Never returns raw Sunni dates.
 */
export function useHijriDate(gregorianDate, adjustment = 0) {
  const hijri = useMemo(() => {
    const dateMidnight = new Date(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    )

    // Search through recent years/months to find which Shia month contains today
    // Start from a reasonable estimate and search nearby
    const approxYear = dateMidnight.getFullYear() < 2030
      ? Math.floor((dateMidnight.getFullYear() - 621.57) * (12 / 12.3685))
      : 1447

    for (let y = approxYear + 1; y >= approxYear - 1; y--) {
      for (let m = 12; m >= 1; m--) {
        const startStr = getMonthStart(y, m)
        if (!startStr) continue

        const [sy, sm, sd] = startStr.split('-').map(Number)
        const start = new Date(sy, sm - 1, sd)
        const diffDays = Math.round((dateMidnight - start) / (1000 * 60 * 60 * 24))
        const hijriDay = diffDays + 1 + adjustment

        if (hijriDay >= 1 && hijriDay <= 30) {
          return { year: y, month: m, day: hijriDay }
        }
      }
    }

    // Should never reach here, but just in case
    return { year: approxYear, month: 1, day: 1 }
  }, [gregorianDate.getTime(), adjustment])

  return { hijri }
}
