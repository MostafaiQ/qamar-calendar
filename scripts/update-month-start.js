/**
 * Scrapes Hijri month start dates from imam-us.org and AlAdhan API.
 * Updates public/overrides/month-starts.json.
 * Runs via GitHub Actions cron or manually.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OVERRIDES_PATH = join(__dirname, '..', 'public', 'overrides', 'month-starts.json')

// Hijri month names for parsing
const hijriMonthNames = {
  'muharram': 1, 'safar': 2, 'rabi al-awwal': 3, 'rabi al-thani': 4,
  'jumada al-ula': 5, 'jumada al-akhirah': 6, 'rajab': 7, 'shaban': 8,
  'ramadan': 9, 'shawwal': 10, 'dhul qadah': 11, 'dhul hijjah': 12,
  'rabi i': 3, 'rabi ii': 4, 'jumada i': 5, 'jumada ii': 6,
  'dhu al-qadah': 11, 'dhu al-hijjah': 12, "dhu'l-qa'dah": 11, "dhu'l-hijjah": 12,
}

async function fetchAlAdhanMonthStart() {
  try {
    // Get current Hijri date
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const url = `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`
    const res = await fetch(url)
    if (!res.ok) return null

    const json = await res.json()
    const h = json.data.hijri
    const hijriYear = parseInt(h.year)
    const hijriMonth = parseInt(h.month.number)
    const hijriDay = parseInt(h.day)

    // Calculate Gregorian date of month start
    const daysBack = hijriDay - 1
    const monthStart = new Date(today)
    monthStart.setDate(monthStart.getDate() - daysBack)

    return {
      year: hijriYear,
      month: hijriMonth,
      gregorianStart: monthStart.toISOString().slice(0, 10),
      source: 'aladhan-api',
      fetchedAt: new Date().toISOString(),
    }
  } catch (e) {
    console.error('AlAdhan fetch failed:', e.message)
    return null
  }
}

async function main() {
  console.log('Updating Hijri month starts...')

  // Read current overrides
  let overrides = {}
  try {
    overrides = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf-8'))
  } catch (e) {
    console.log('No existing overrides, starting fresh.')
  }

  // Try AlAdhan API
  const result = await fetchAlAdhanMonthStart()
  if (result) {
    const yearStr = String(result.year)
    const monthStr = String(result.month)

    if (!overrides[yearStr]) overrides[yearStr] = {}

    if (!overrides[yearStr][monthStr]) {
      overrides[yearStr][monthStr] = {
        gregorianStart: result.gregorianStart,
        source: result.source,
        fetchedAt: result.fetchedAt,
      }
      console.log(`Added: ${yearStr}/${monthStr} -> ${result.gregorianStart} (${result.source})`)
    } else {
      console.log(`Month ${yearStr}/${monthStr} already recorded, skipping.`)
    }
  } else {
    console.log('Could not fetch month start data.')
  }

  // Write back
  writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2) + '\n')
  console.log('Done.')
}

main().catch(console.error)
