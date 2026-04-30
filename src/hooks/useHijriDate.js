import { useMemo } from 'react'
import { toHijri } from 'hijri-converter'
import { getMonthStart } from '../data/monthStarts.js'

/**
 * Resolve today's Shia Hijri date.
 * Priority: confirmed Sistani overrides → chained from nearest anchor → hijri-converter fallback.
 */
export function useHijriDate(gregorianDate, adjustment = 0) {
  const hijri = useMemo(() => {
    const dateMidnight = new Date(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    )

    // Get approximate Hijri year/month from hijri-converter (just for searching)
    const { hy, hm } = toHijri(
      dateMidnight.getFullYear(),
      dateMidnight.getMonth() + 1,
      dateMidnight.getDate()
    )

    // Search nearby months (current, previous, next) to find the right one
    const candidates = [
      { y: hy, m: hm },
      { y: hy, m: hm + 1 > 12 ? 1 : hm + 1, yAdj: hm + 1 > 12 ? 1 : 0 },
      { y: hy, m: hm - 1 < 1 ? 12 : hm - 1, yAdj: hm - 1 < 1 ? -1 : 0 },
    ]

    for (const c of candidates) {
      const year = c.y + (c.yAdj || 0)
      const startStr = getMonthStart(year, c.m)
      if (!startStr) continue

      const [sy, sm, sd] = startStr.split('-').map(Number)
      const start = new Date(sy, sm - 1, sd)
      const diffDays = Math.round((dateMidnight - start) / (1000 * 60 * 60 * 24))
      const hijriDay = diffDays + 1 + adjustment

      if (hijriDay >= 1 && hijriDay <= 30) {
        return { year, month: c.m, day: hijriDay }
      }
    }

    // Last resort: use hijri-converter directly
    const { hy: fy, hm: fm, hd: fd } = toHijri(
      dateMidnight.getFullYear(),
      dateMidnight.getMonth() + 1,
      dateMidnight.getDate()
    )
    return { year: fy, month: fm, day: fd + adjustment }
  }, [gregorianDate.getTime(), adjustment])

  return { hijri }
}
