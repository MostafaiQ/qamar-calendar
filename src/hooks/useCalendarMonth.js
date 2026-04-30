import { useState, useEffect } from 'react'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getWeekdayIndex, addDays } from '../utils/dateHelpers.js'
import { confirmedStarts, getMonthStart, getMonthLength } from '../data/monthStarts.js'

/**
 * Fetch Gregorian start of a Hijri month from AlAdhan API.
 */
async function fetchMonthStartFromApi(hijriYear, hijriMonth) {
  try {
    const url = `https://api.aladhan.com/v1/hToG/01-${String(hijriMonth).padStart(2, '0')}-${hijriYear}`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const json = await res.json()
    const g = json.data.gregorian
    return `${g.year}-${String(g.month.number).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`
  } catch (e) {
    return null
  }
}

/**
 * Returns a full month of day objects for the calendar grid.
 * Priority: confirmed overrides → AlAdhan API → monthStarts.js fallback.
 */
export function useCalendarMonth(hijriYear, hijriMonth, adjustment = 0) {
  const [days, setDays] = useState([])

  useEffect(() => {
    let cancelled = false

    async function buildMonth() {
      const key = `${hijriYear}-${hijriMonth}`
      let startStr

      // 1. Confirmed override (Shia sighting) — always wins
      if (confirmedStarts[key]) {
        startStr = confirmedStarts[key]
      } else {
        // 2. Try AlAdhan API
        startStr = await fetchMonthStartFromApi(hijriYear, hijriMonth)
        // 3. Fall back to chained/hijri-converter
        if (!startStr) startStr = getMonthStart(hijriYear, hijriMonth)
      }

      if (cancelled || !startStr) { setDays([]); return }

      const [y, m, d] = startStr.split('-').map(Number)
      let startGregorian = new Date(y, m - 1, d)

      if (adjustment !== 0) {
        startGregorian = addDays(startGregorian, -adjustment)
      }

      // Get month length
      const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
      const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
      const nextKey = `${nextYear}-${nextMonth}`

      let nextStartStr = confirmedStarts[nextKey]
        || await fetchMonthStartFromApi(nextYear, nextMonth)
        || getMonthStart(nextYear, nextMonth)

      let monthLength = 30
      if (nextStartStr) {
        const [ny, nm, nd] = nextStartStr.split('-').map(Number)
        const diff = Math.round((new Date(ny, nm - 1, nd) - new Date(y, m - 1, d)) / (1000 * 60 * 60 * 24))
        if (diff === 29 || diff === 30) monthLength = diff
      } else {
        monthLength = getMonthLength(hijriYear, hijriMonth)
      }

      if (cancelled) return

      const monthDays = []
      for (let i = 0; i < monthLength; i++) {
        const gDate = addDays(startGregorian, i)
        const hijriDay = i + 1
        const weekdayIndex = getWeekdayIndex(gDate)
        const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay, gDate)
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

      if (!cancelled) setDays(monthDays)
    }

    buildMonth()
    return () => { cancelled = true }
  }, [hijriYear, hijriMonth, adjustment])

  return { days }
}
