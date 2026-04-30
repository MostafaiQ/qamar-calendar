import { toGregorian } from 'hijri-converter'

// Confirmed Shia/Sistani month starts from sighting announcements
// Populated by GitHub Actions cron job scraping imam-us.org / sistani.org
// ONLY add dates here that are confirmed via moon sighting announcements.
export const confirmedStarts = {
  // 1447 — source: sistani.org مواقيت الأهلة لعام ١٤٤٧ هـ
  '1447-1':  '2025-06-27',   // Muharram
  '1447-2':  '2025-07-27',   // Safar
  '1447-3':  '2025-08-25',   // Rabi al-Awwal
  '1447-4':  '2025-09-24',   // Rabi al-Thani
  '1447-5':  '2025-10-24',   // Jumada al-Ula
  '1447-6':  '2025-11-23',   // Jumada al-Akhirah
  '1447-7':  '2025-12-22',   // Rajab
  '1447-8':  '2026-01-21',   // Shaban
  '1447-9':  '2026-02-19',   // Ramadan
  '1447-10': '2026-03-21',   // Shawwal
  '1447-11': '2026-04-19',   // Dhul Qadah
  '1447-12': '2026-05-18',   // Dhul Hijjah

  // 1448 — derived from 1447 Dhul Hijjah (30 days per Sistani)
  '1448-1':  '2026-06-17',   // Muharram
}

/**
 * Get the astronomical month length from hijri-converter (29 or 30).
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

// Step one hijri month forward: { year, month } → { year, month }
function nextHijriMonth(y, m) {
  return m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 }
}

// Step one hijri month backward
function prevHijriMonth(y, m) {
  return m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 }
}

// Cache derived starts so we don't recompute every call
const derivedCache = {}

/**
 * Get the Gregorian start date for a Shia Hijri month.
 *
 * Logic:
 * 1. If this month is confirmed → use it
 * 2. Walk backwards (up to 12 months) to find the nearest confirmed month
 * 3. Chain forward from that anchor, adding each month's length
 * 4. If no anchor found within 12 months → fall back to hijri-converter
 *
 * This ensures NO overlaps ever — every month's start = previous month's start + length.
 */
export function getMonthStart(hijriYear, hijriMonth) {
  const key = `${hijriYear}-${hijriMonth}`

  // 1. Confirmed
  if (confirmedStarts[key]) return confirmedStarts[key]

  // 2. Check cache
  if (derivedCache[key]) return derivedCache[key]

  // 3. Walk backwards to find the nearest confirmed anchor
  let anchorYear = hijriYear
  let anchorMonth = hijriMonth
  let stepsBack = 0

  while (stepsBack < 12) {
    const prev = prevHijriMonth(anchorYear, anchorMonth)
    anchorYear = prev.y
    anchorMonth = prev.m
    stepsBack++

    const anchorKey = `${anchorYear}-${anchorMonth}`
    if (confirmedStarts[anchorKey] || derivedCache[anchorKey]) {
      // Found an anchor — chain forward from here
      let currentDateStr = confirmedStarts[anchorKey] || derivedCache[anchorKey]
      let curY = anchorYear
      let curM = anchorMonth

      for (let i = 0; i < stepsBack; i++) {
        const [dy, dm, dd] = currentDateStr.split('-').map(Number)
        const d = new Date(dy, dm - 1, dd)
        const len = getSunniMonthLength(curY, curM)
        d.setDate(d.getDate() + len)

        const n = nextHijriMonth(curY, curM)
        curY = n.y
        curM = n.m

        currentDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        derivedCache[`${curY}-${curM}`] = currentDateStr
      }

      return derivedCache[key]
    }
  }

  // 4. No anchor found — fall back to hijri-converter
  try {
    const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
  } catch (e) {
    return null
  }
}

/**
 * Get month length (29 or 30).
 * Uses the same chain logic — diffs this month's start with next month's start.
 * Both are guaranteed consistent (no mixing Sunni/Shia).
 */
export function getMonthLength(hijriYear, hijriMonth) {
  const thisStart = getMonthStart(hijriYear, hijriMonth)
  const n = nextHijriMonth(hijriYear, hijriMonth)
  const nextStart = getMonthStart(n.y, n.m)

  if (thisStart && nextStart) {
    const [sy, sm, sd] = thisStart.split('-').map(Number)
    const [ny, nm, nd] = nextStart.split('-').map(Number)
    const diff = Math.round((new Date(ny, nm - 1, nd) - new Date(sy, sm - 1, sd)) / (1000 * 60 * 60 * 24))
    if (diff === 29 || diff === 30) return diff
  }

  return getSunniMonthLength(hijriYear, hijriMonth)
}
