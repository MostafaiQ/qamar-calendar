import { toGregorian } from 'hijri-converter'

// Confirmed Shia/Sistani month starts from sighting announcements
// Populated by GitHub Actions cron job scraping imam-us.org / sistani.org
// ONLY add dates here that are confirmed via moon sighting announcements.
const confirmedStarts = {
  '1447-9':  '2026-02-19',   // Ramadan — confirmed imam-us.org
}

/**
 * Get the astronomical month length from hijri-converter (29 or 30).
 * This is the correct lunar 29/30 alternation pattern.
 */
function getSunniMonthLength(hijriYear, hijriMonth) {
  try {
    const s = toGregorian(hijriYear, hijriMonth, 1)
    const nm = hijriMonth === 12 ? 1 : hijriMonth + 1
    const ny = hijriMonth === 12 ? hijriYear + 1 : hijriYear
    const n = toGregorian(ny, nm, 1)
    const start = new Date(s.gy, s.gm - 1, s.gd)
    const next = new Date(n.gy, n.gm - 1, n.gd)
    const diff = Math.round((next - start) / (1000 * 60 * 60 * 24))
    return (diff === 29 || diff === 30) ? diff : 30
  } catch (e) {
    return 30
  }
}

/**
 * Get the Gregorian start date for a Shia Hijri month.
 * Priority: confirmed sighting > derived from confirmed previous month > hijri-converter
 */
export function getMonthStart(hijriYear, hijriMonth) {
  const key = `${hijriYear}-${hijriMonth}`

  // 1. Confirmed sighting
  if (confirmedStarts[key]) {
    return confirmedStarts[key]
  }

  // 2. Derive from confirmed previous month + its length
  const prevMonth = hijriMonth === 1 ? 12 : hijriMonth - 1
  const prevYear = hijriMonth === 1 ? hijriYear - 1 : hijriYear
  const prevKey = `${prevYear}-${prevMonth}`
  if (confirmedStarts[prevKey]) {
    const [py, pm, pd] = confirmedStarts[prevKey].split('-').map(Number)
    const prevStart = new Date(py, pm - 1, pd)
    // Use the correct 29/30 length for the previous month
    const prevLength = getSunniMonthLength(prevYear, prevMonth)
    prevStart.setDate(prevStart.getDate() + prevLength)
    const y = prevStart.getFullYear()
    const m = String(prevStart.getMonth() + 1).padStart(2, '0')
    const d = String(prevStart.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // 3. Fallback: hijri-converter as-is
  try {
    const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
  } catch (e) {
    return null
  }
}

/**
 * Get month length (29 or 30).
 * If both months confirmed: use actual diff.
 * Otherwise: use hijri-converter's 29/30 pattern.
 */
export function getMonthLength(hijriYear, hijriMonth) {
  const thisKey = `${hijriYear}-${hijriMonth}`
  const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
  const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
  const nextKey = `${nextYear}-${nextMonth}`

  // If both confirmed, use actual diff
  if (confirmedStarts[thisKey] && confirmedStarts[nextKey]) {
    const [sy, sm, sd] = confirmedStarts[thisKey].split('-').map(Number)
    const [ny, nm, nd] = confirmedStarts[nextKey].split('-').map(Number)
    const diff = Math.round((new Date(ny, nm-1, nd) - new Date(sy, sm-1, sd)) / (1000*60*60*24))
    if (diff === 29 || diff === 30) return diff
  }

  // Otherwise use hijri-converter's correct 29/30 pattern
  return getSunniMonthLength(hijriYear, hijriMonth)
}
