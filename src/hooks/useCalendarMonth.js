import { useState, useEffect } from 'react'
import { toHijri, toGregorian } from 'hijri-converter'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'

/**
 * Returns a full month of day objects for the calendar grid.
 * Uses hijri-converter directly for fast local computation.
 */
export function useCalendarMonth(hijriYear, hijriMonth, refGregorianDate) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const adjustment = parseInt(localStorage.getItem('hijriAdjustment') || '0')

    try {
      // Get Gregorian date for 1st of this Hijri month
      const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
      const startGregorian = new Date(gy, gm - 1, gd)

      // Apply adjustment
      const adjustedStart = addDays(startGregorian, -adjustment)

      // Build 30 days (or 29)
      const monthDays = []
      for (let i = 0; i < 30; i++) {
        const gDate = addDays(adjustedStart, i)
        const hijriDay = i + 1

        // Verify this day is still in the same month
        try {
          const check = toHijri(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate())
          const adjDay = check.hd + adjustment
          // If the conversion doesn't match, we've gone past the month
          if (check.hm !== hijriMonth && i > 0) break
        } catch (e) {
          // If conversion fails for day 30, month is only 29 days
          if (i === 29) break
        }

        const weekdayIndex = getWeekdayIndex(gDate)
        const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay)
        const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)

        monthDays.push({
          hijriDay,
          gregorianDate: gDate,
          weekdayIndex,
          signIndex,
          consensus,
        })
      }

      setDays(monthDays)
    } catch (e) {
      console.error('Failed to build month:', e)
      setDays([])
    }

    setLoading(false)
  }, [hijriYear, hijriMonth])

  return { days, loading }
}
