import { useMemo } from 'react'
import { toGregorian } from 'hijri-converter'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'
import monthStarts from '../data/monthStarts.js'

/**
 * Returns a full month of day objects for the calendar grid.
 * Uses Shia overrides first, falls back to hijri-converter.
 */
export function useCalendarMonth(hijriYear, hijriMonth, adjustment = 0) {
  const days = useMemo(() => {
    try {
      let startGregorian

      // Check Shia override first
      const yearOverrides = monthStarts[hijriYear]
      const monthOverride = yearOverrides?.[hijriMonth]
      if (monthOverride) {
        const [y, m, d] = monthOverride.gregorianStart.split('-').map(Number)
        startGregorian = new Date(y, m - 1, d)
      } else {
        // Fallback to hijri-converter (Sunni/Umm al-Qura)
        const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
        startGregorian = new Date(gy, gm - 1, gd)
      }

      // Apply adjustment: shift the month start by -adjustment days
      // +1 means "the real month started 1 day earlier than recorded"
      if (adjustment !== 0) {
        startGregorian = addDays(startGregorian, -adjustment)
      }

      // Determine month length: check if next month has an override too
      let monthLength = 30
      const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
      const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
      const nextOverride = monthStarts[nextYear]?.[nextMonth]
      if (nextOverride) {
        const [y, m, d] = nextOverride.gregorianStart.split('-').map(Number)
        const nextDate = new Date(y, m - 1, d)
        const diff = Math.round((nextDate - startGregorian) / (1000 * 60 * 60 * 24))
        if (diff >= 29 && diff <= 30) monthLength = diff
      } else {
        try {
          const next = toGregorian(nextYear, nextMonth, 1)
          const nextDate = new Date(next.gy, next.gm - 1, next.gd)
          const diff = Math.round((nextDate - startGregorian) / (1000 * 60 * 60 * 24))
          if (diff >= 29 && diff <= 30) monthLength = diff
        } catch (e) {
          // default 30
        }
      }

      const monthDays = []
      for (let i = 0; i < monthLength; i++) {
        const gDate = addDays(startGregorian, i)
        const hijriDay = i + 1
        const weekdayIndex = getWeekdayIndex(gDate)
        const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay)
        const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)

        monthDays.push({
          hijriDay,
          gregorianDate: gDate,
          weekdayIndex,
          signIndex,
          nightDuration,
          positionInSign,
          consensus,
        })
      }

      return monthDays
    } catch (e) {
      console.error('Failed to build month:', e)
      return []
    }
  }, [hijriYear, hijriMonth, adjustment])

  return { days }
}
