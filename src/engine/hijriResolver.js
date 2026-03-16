import { toHijri } from 'hijri-converter'

/**
 * Resolve Gregorian date to Hijri date using priority chain:
 * 1. Manual overrides (month-starts.json)
 * 2. AlAdhan API (Jafari method)
 * 3. hijri-converter (offline fallback)
 */

let monthStartsCache = null

async function loadMonthStarts() {
  if (monthStartsCache) return monthStartsCache
  try {
    const base = import.meta.env.BASE_URL || '/'
    const res = await fetch(`${base}overrides/month-starts.json`)
    if (res.ok) {
      monthStartsCache = await res.json()
      return monthStartsCache
    }
  } catch (e) {
    // silent fail, use other methods
  }
  return {}
}

function daysDiff(dateA, dateB) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  return Math.round((a - b) / (1000 * 60 * 60 * 24))
}

function checkOverrides(gregorianDate, overrides) {
  const dateStr = gregorianDate.toISOString().slice(0, 10)

  // Collect all overrides sorted newest first
  const entries = []
  for (const [year, months] of Object.entries(overrides)) {
    for (const [month, data] of Object.entries(months)) {
      entries.push({
        year: parseInt(year),
        month: parseInt(month),
        gregorianStart: data.gregorianStart,
      })
    }
  }

  entries.sort((a, b) => new Date(b.gregorianStart) - new Date(a.gregorianStart))

  for (const entry of entries) {
    if (dateStr >= entry.gregorianStart) {
      const diff = daysDiff(dateStr, entry.gregorianStart)
      const hijriDay = diff + 1
      if (hijriDay >= 1 && hijriDay <= 30) {
        return { year: entry.year, month: entry.month, day: hijriDay, source: 'override' }
      }
    }
  }
  return null
}

async function fetchAlAdhan(gregorianDate, adjustment) {
  const dd = String(gregorianDate.getDate()).padStart(2, '0')
  const mm = String(gregorianDate.getMonth() + 1).padStart(2, '0')
  const yyyy = gregorianDate.getFullYear()
  const url = `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=${adjustment}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    const h = json.data.hijri
    return {
      year: parseInt(h.year),
      month: parseInt(h.month.number),
      day: parseInt(h.day),
      source: 'aladhan',
    }
  } catch (e) {
    return null
  }
}

function localFallback(gregorianDate, adjustment) {
  try {
    const { hy, hm, hd } = toHijri(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate()
    )
    let day = hd + adjustment
    let month = hm
    let year = hy
    if (day < 1) { month--; day += 30 }
    if (day > 30) { month++; day -= 30 }
    if (month < 1) { year--; month = 12 }
    if (month > 12) { year++; month = 1 }
    return { year, month, day, source: 'local' }
  } catch (e) {
    return null
  }
}

export async function resolveHijriDate(gregorianDate) {
  const adjustment = parseInt(localStorage.getItem('hijriAdjustment') || '0')

  // 1. Check overrides
  const overrides = await loadMonthStarts()
  const overrideResult = checkOverrides(gregorianDate, overrides)
  if (overrideResult) return overrideResult

  // 2. Try AlAdhan API
  const apiResult = await fetchAlAdhan(gregorianDate, adjustment)
  if (apiResult) return apiResult

  // 3. Fallback: hijri-converter
  const localResult = localFallback(gregorianDate, adjustment)
  if (localResult) return localResult

  // Ultimate fallback
  return { year: 1447, month: 1, day: 1, source: 'fallback' }
}

export function clearMonthStartsCache() {
  monthStartsCache = null
}
