import { useMemo } from 'react'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'
import { getMonthStart, getMonthLength } from '../data/monthStarts.js'

/**
 * Returns a full month of day objects for the calendar grid.
 * Always uses Shia calendar (confirmed sightings or Sunni+1 offset).
 */
export function useCalendarMonth(hijriYear, hijriMonth, adjustment = 0) {
  const days = useMemo(() => {
    try {
      const startStr = getMonthStart(hijriYear, hijriMonth)
      if (!startStr) return []

      const [y, m, d] = startStr.split('-').map(Number)
      let startGregorian = new Date(y, m - 1, d)

      // Apply manual adjustment
      if (adjustment !== 0) {
        startGregorian = addDays(startGregorian, -adjustment)
      }

      const monthLength = getMonthLength(hijriYear, hijriMonth)

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
