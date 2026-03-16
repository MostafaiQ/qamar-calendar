import { toGregorian } from 'hijri-converter'

// Confirmed Shia/Sistani month starts from sighting announcements
// Populated by GitHub Actions cron job scraping imam-us.org / sistani.org
// Manual entries can be added here too
// ONLY add dates here that are confirmed via moon sighting announcements.
// The cron job will add new months as they are confirmed.
// Do NOT guess or pre-populate — wrong dates break month lengths.
const confirmedStarts = {
  '1447-9':  '2026-02-19',   // Ramadan — confirmed imam-us.org
}

/**
 * Get the Gregorian start date for a Shia Hijri month.
 * Uses confirmed/scraped sighting data first.
 * Falls back to hijri-converter (Sunni) only if no data exists yet.
 * The cron job will fill in missing months over time.
 */
export function getMonthStart(hijriYear, hijriMonth) {
  const key = `${hijriYear}-${hijriMonth}`

  if (confirmedStarts[key]) {
    return confirmedStarts[key]
  }

  // Check if the PREVIOUS month is confirmed — if so, derive this month's
  // start from it (previous start + 30 days) to avoid overlap
  const prevMonth = hijriMonth === 1 ? 12 : hijriMonth - 1
  const prevYear = hijriMonth === 1 ? hijriYear - 1 : hijriYear
  const prevKey = `${prevYear}-${prevMonth}`
  if (confirmedStarts[prevKey]) {
    const [py, pm, pd] = confirmedStarts[prevKey].split('-').map(Number)
    const prevStart = new Date(py, pm - 1, pd)
    // Previous month is 30 days (default when next isn't confirmed)
    prevStart.setDate(prevStart.getDate() + 30)
    const y = prevStart.getFullYear()
    const m = String(prevStart.getMonth() + 1).padStart(2, '0')
    const d = String(prevStart.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Fallback: use hijri-converter as-is (no offset assumption)
  try {
    const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
  } catch (e) {
    return null
  }
}

/**
 * Get month length.
 * Only trust the diff when BOTH this month and next month are confirmed.
 * If either is unconfirmed (from hijri-converter fallback), default to 30.
 */
export function getMonthLength(hijriYear, hijriMonth) {
  const thisKey = `${hijriYear}-${hijriMonth}`
  const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
  const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
  const nextKey = `${nextYear}-${nextMonth}`

  const thisConfirmed = !!confirmedStarts[thisKey]
  const nextConfirmed = !!confirmedStarts[nextKey]

  // Only compute diff if BOTH months are confirmed sightings
  if (thisConfirmed && nextConfirmed) {
    const [sy, sm, sd] = confirmedStarts[thisKey].split('-').map(Number)
    const [ny, nm, nd] = confirmedStarts[nextKey].split('-').map(Number)
    const start = new Date(sy, sm - 1, sd)
    const next = new Date(ny, nm - 1, nd)
    const diff = Math.round((next - start) / (1000 * 60 * 60 * 24))
    if (diff >= 29 && diff <= 30) return diff
  }

  // Otherwise default to 30 — never mix confirmed with unconfirmed
  return 30
}

/**
 * Add a confirmed month start (called by the scraper/cron)
 */
export function addConfirmedStart(hijriYear, hijriMonth, gregorianStart) {
  confirmedStarts[`${hijriYear}-${hijriMonth}`] = gregorianStart
}
