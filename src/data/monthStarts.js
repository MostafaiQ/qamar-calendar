import { toGregorian } from 'hijri-converter'

// Confirmed Shia/Sistani month starts from sighting announcements
// These take absolute precedence over computed dates
const confirmedStarts = {
  '1447-9': '2026-02-19',  // Ramadan - confirmed imam-us.org
}

// Shia calendar typically starts 1 day after the Sunni (Umm al-Qura) calendar
// because Shia require physical moon sighting while Sunni use astronomical calculation.
// This offset is applied to ALL months as the base Shia estimate.
const SHIA_OFFSET = 1

/**
 * Get the Gregorian start date for a Shia Hijri month.
 * Uses confirmed sighting data first, otherwise computes Sunni + offset.
 */
export function getMonthStart(hijriYear, hijriMonth) {
  const key = `${hijriYear}-${hijriMonth}`

  // Check confirmed sightings first
  if (confirmedStarts[key]) {
    return confirmedStarts[key]
  }

  // Compute from Sunni + Shia offset
  try {
    const { gy, gm, gd } = toGregorian(hijriYear, hijriMonth, 1)
    const sunni = new Date(gy, gm - 1, gd)
    sunni.setDate(sunni.getDate() + SHIA_OFFSET)
    const y = sunni.getFullYear()
    const m = String(sunni.getMonth() + 1).padStart(2, '0')
    const d = String(sunni.getDate()).padStart(2, '0')
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
