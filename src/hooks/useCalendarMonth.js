import { useState, useEffect } from 'react'
import { resolveHijriDate } from '../engine/hijriResolver.js'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'

/**
 * Returns a full month of day objects for the calendar grid.
 * Starts from the first day of the given Hijri month.
 */
export function useCalendarMonth(hijriYear, hijriMonth, refGregorianDate) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function buildMonth() {
      // Find the Gregorian date for the 1st of this Hijri month
      // by searching around the reference date
      let startGregorian = null
      const refHijri = await resolveHijriDate(refGregorianDate)
      if (!refHijri) return

      // Calculate offset to reach day 1 of the target month
      let dayOffset = 0
      if (refHijri.year === hijriYear && refHijri.month === hijriMonth) {
        dayOffset = -(refHijri.day - 1)
      } else {
        // Rough estimate: each Hijri month ~29.5 days
        const monthDiff = (hijriYear - refHijri.year) * 12 + (hijriMonth - refHijri.month)
        dayOffset = Math.round(monthDiff * 29.5) - (refHijri.day - 1)
      }

      startGregorian = addDays(refGregorianDate, dayOffset)

      // Verify and adjust
      let startHijri = await resolveHijriDate(startGregorian)
      let attempts = 0
      while (startHijri && startHijri.day !== 1 && attempts < 5) {
        const adj = -(startHijri.day - 1)
        startGregorian = addDays(startGregorian, adj)
        startHijri = await resolveHijriDate(startGregorian)
        attempts++
      }

      // Build 30 days
      const monthDays = []
      for (let i = 0; i < 30; i++) {
        const gDate = addDays(startGregorian, i)
        const hDate = await resolveHijriDate(gDate)
        if (!hDate || cancelled) break

        // Only include days that belong to this month
        if (hDate.month !== hijriMonth && monthDays.length > 0) break

        const weekdayIndex = getWeekdayIndex(gDate)
        const { signIndex, nightDuration, positionInSign } = getMoonSign(hDate.day)
        const consensus = getConsensus(hDate.day, signIndex, weekdayIndex, positionInSign)

        monthDays.push({
          hijriDay: hDate.day,
          gregorianDate: gDate,
          weekdayIndex,
          signIndex,
          consensus,
        })
      }

      if (!cancelled) {
        setDays(monthDays)
        setLoading(false)
      }
    }

    buildMonth()
    return () => { cancelled = true }
  }, [hijriYear, hijriMonth, refGregorianDate.getTime()])

  return { days, loading }
}
