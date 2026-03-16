import { toGregorian } from 'hijri-converter'

// Confirmed Shia/Sistani month starts from sighting announcements
// Populated by GitHub Actions cron job scraping imam-us.org / sistani.org
// Manual entries can be added here too
const confirmedStarts = {
  // 1446
  '1446-1':  '2024-07-07',
  '1446-2':  '2024-08-06',
  '1446-3':  '2024-09-05',
  '1446-4':  '2024-10-04',
  '1446-5':  '2024-11-03',
  '1446-6':  '2024-12-02',
  '1446-7':  '2025-01-01',
  '1446-8':  '2025-01-31',
  '1446-9':  '2025-03-01',
  '1446-10': '2025-03-30',
  '1446-11': '2025-04-29',
  '1446-12': '2025-05-28',
  // 1447
  '1447-1':  '2025-06-26',
  '1447-2':  '2025-07-26',
  '1447-3':  '2025-08-24',
  '1447-4':  '2025-09-23',
  '1447-5':  '2025-10-23',
  '1447-6':  '2025-11-21',
  '1447-7':  '2025-12-21',
  '1447-8':  '2026-01-20',
  '1447-9':  '2026-02-19',   // Ramadan — confirmed imam-us.org
  '1447-10': '2026-03-20',
  '1447-11': '2026-04-19',
  '1447-12': '2026-05-18',
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

  // Fallback: use hijri-converter as-is (no offset assumption)
  // The user can manually adjust, and the cron job will add correct data
  try {
    const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
    const y = gy
    const m = String(gm).padStart(2, '0')
    const d = String(gd).padStart(2, '0')
    return `${y}-${m}-${d}`
  } catch (e) {
    return null
  }
}

/**
 * Get month length by diffing this month's start with next month's start.
 */
export function getMonthLength(hijriYear, hijriMonth) {
  const startStr = getMonthStart(hijriYear, hijriMonth)
  const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1
  const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear
  const nextStr = getMonthStart(nextYear, nextMonth)

  if (!startStr || !nextStr) return 30

  const [sy, sm, sd] = startStr.split('-').map(Number)
  const [ny, nm, nd] = nextStr.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  const next = new Date(ny, nm - 1, nd)
  const diff = Math.round((next - start) / (1000 * 60 * 60 * 24))

  return (diff >= 29 && diff <= 30) ? diff : 30
}

/**
 * Add a confirmed month start (called by the scraper/cron)
 */
export function addConfirmedStart(hijriYear, hijriMonth, gregorianStart) {
  confirmedStarts[`${hijriYear}-${hijriMonth}`] = gregorianStart
}
