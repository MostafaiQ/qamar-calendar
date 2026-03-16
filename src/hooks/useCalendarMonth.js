import { useMemo } from 'react'
import { toHijri, toGregorian } from 'hijri-converter'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'

/**
 * Returns a full month of day objects for the calendar grid.
 * Uses hijri-converter directly for fast local computation.
 */
export function useCalendarMonth(hijriYear, hijriMonth, adjustment = 0) {
  const days = useMemo(() => {
    try {
      // Get Gregorian date for 1st of this Hijri month
      const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
      const startGregorian = new Date(gy, gm - 1, gd)

      // Apply adjustment (shift start date)
      const adjustedStart = addDays(startGregorian, -adjustment)

      // Determine month length by checking when next month starts
      let monthLength = 30
      try {
        const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
        const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
        const next = toGregorian(nextYear, nextMonth, 1)
        const nextDate = new Date(next.gy, next.gm - 1, next.gd)
        const diff = Math.round((nextDate - startGregorian) / (1000 * 60 * 60 * 24))
        if (diff === 29 || diff === 30) monthLength = diff
      } catch (e) {
        // default to 30
      }

      const monthDays = []
      for (let i = 0; i < monthLength; i++) {
        const gDate = addDays(adjustedStart, i)
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
