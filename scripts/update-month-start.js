/**
 * Scrapes confirmed Shia Hijri month starts from official sources.
 * Updates src/data/monthStarts.js with new confirmed sighting dates.
 * Runs via GitHub Actions cron (twice daily) or manually.
 *
 * Sources:
 * 1. imam-us.org — Sistani's representative in the US
 * 2. sistani.org — Ayatollah Sistani's official office
 * 3. AlAdhan API with Shia adjustment for cross-reference
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { toHijri } from 'hijri-converter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MONTH_STARTS_PATH = join(__dirname, '..', 'src', 'data', 'monthStarts.js')

const HIJRI_MONTHS_EN = {
  'muharram': 1, 'safar': 2, 'rabi': 3,
  'rabi al-awwal': 3, 'rabi al-thani': 4, 'rabi al-awal': 3,
  'jumada': 5, 'jumada al-ula': 5, 'jumada al-akhirah': 6,
  'rajab': 7, 'shaban': 8, "sha'ban": 8,
  'ramadan': 9, 'ramazan': 9, 'ramadhan': 9,
  'shawwal': 10, 'shawal': 10,
  'dhul qadah': 11, 'dhu al-qadah': 11, 'dhul qi\'dah': 11, 'zul qadah': 11,
  'dhul hijjah': 12, 'dhu al-hijjah': 12, 'zul hijjah': 12,
}

const GREG_MONTHS = {
  'january': 1, 'february': 2, 'march': 3, 'april': 4,
  'may': 5, 'june': 6, 'july': 7, 'august': 8,
  'september': 9, 'october': 10, 'november': 11, 'december': 12,
}

/**
 * Scrape imam-us.org for crescent sighting announcements
 */
async function scrapeImamUs() {
  console.log('Scraping imam-us.org...')
  try {
    const res = await fetch('https://www.imam-us.org', {
      headers: { 'User-Agent': 'QamarCalendar/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) { console.log('  HTTP', res.status); return [] }
    const html = await res.text()

    const results = []

    // Pattern: "First day of [Month] [Year] is [Day], [GregMonth] [GregDay], [GregYear]"
    const p1 = /first\s+day\s+of\s+(\w[\w\s'-]*?\w)\s+(\d{4})\s+.*?(\w+day),?\s+(\w+)\s+(\d{1,2}),?\s+(\d{4})/gi
    let m
    while ((m = p1.exec(html)) !== null) {
      const hijriMonth = matchHijriMonth(m[1])
      const hijriYear = parseInt(m[2])
      const gregMonth = GREG_MONTHS[m[4].toLowerCase()]
      const gregDay = parseInt(m[5])
      const gregYear = parseInt(m[6])
      if (hijriMonth && gregMonth && hijriYear > 1400) {
        results.push({
          year: hijriYear, month: hijriMonth,
          gregorianStart: `${gregYear}-${String(gregMonth).padStart(2,'0')}-${String(gregDay).padStart(2,'0')}`,
          source: 'imam-us.org',
        })
      }
    }

    // Pattern: "[Month] [Year] crescent ... [GregMonth] [GregDay]"
    const p2 = /(\w[\w\s'-]*?)\s+(\d{4})\s+(?:crescent|moon|hilal).*?(\w+)\s+(\d{1,2}),?\s+(\d{4})/gi
    while ((m = p2.exec(html)) !== null) {
      const hijriMonth = matchHijriMonth(m[1])
      const hijriYear = parseInt(m[2])
      const gregMonth = GREG_MONTHS[m[3].toLowerCase()]
      const gregDay = parseInt(m[4])
      const gregYear = parseInt(m[5])
      if (hijriMonth && gregMonth && hijriYear > 1400) {
        results.push({
          year: hijriYear, month: hijriMonth,
          gregorianStart: `${gregYear}-${String(gregMonth).padStart(2,'0')}-${String(gregDay).padStart(2,'0')}`,
          source: 'imam-us.org',
        })
      }
    }

    console.log(`  Found ${results.length} dates`)
    return results
  } catch (e) {
    console.log('  Failed:', e.message)
    return []
  }
}

/**
 * Scrape sistani.org for month announcements
 */
async function scrapeSistani() {
  console.log('Scraping sistani.org...')
  try {
    const res = await fetch('https://www.sistani.org/english/archive/', {
      headers: { 'User-Agent': 'QamarCalendar/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) { console.log('  HTTP', res.status); return [] }
    const html = await res.text()

    // Look for crescent/moon sighting posts
    const results = []
    const pattern = /(?:crescent|moon|hilal|first\s+day).*?(\w[\w\s'-]+?)\s+(\d{4}).*?(\w+)\s+(\d{1,2}),?\s+(\d{4})/gi
    let m
    while ((m = pattern.exec(html)) !== null) {
      const hijriMonth = matchHijriMonth(m[1])
      const hijriYear = parseInt(m[2])
      const gregMonth = GREG_MONTHS[m[3].toLowerCase()]
      const gregDay = parseInt(m[4])
      const gregYear = parseInt(m[5])
      if (hijriMonth && gregMonth && hijriYear > 1400) {
        results.push({
          year: hijriYear, month: hijriMonth,
          gregorianStart: `${gregYear}-${String(gregMonth).padStart(2,'0')}-${String(gregDay).padStart(2,'0')}`,
          source: 'sistani.org',
        })
      }
    }

    console.log(`  Found ${results.length} dates`)
    return results
  } catch (e) {
    console.log('  Failed:', e.message)
    return []
  }
}

function matchHijriMonth(text) {
  const lower = text.toLowerCase().trim()
  for (const [name, num] of Object.entries(HIJRI_MONTHS_EN)) {
    if (lower.includes(name)) return num
  }
  return null
}

/**
 * Read current confirmedStarts from monthStarts.js
 */
function readCurrentStarts() {
  try {
    const content = readFileSync(MONTH_STARTS_PATH, 'utf-8')
    const starts = {}
    const entries = content.matchAll(/'(\d+-\d+)':\s*'(\d{4}-\d{2}-\d{2})'/g)
    for (const entry of entries) {
      starts[entry[1]] = entry[2]
    }
    return starts
  } catch (e) {
    return {}
  }
}

/**
 * Write updated confirmedStarts back to monthStarts.js
 */
function writeUpdatedStarts(starts) {
  const content = readFileSync(MONTH_STARTS_PATH, 'utf-8')

  const sortedKeys = Object.keys(starts).sort((a, b) => {
    const [ay, am] = a.split('-').map(Number)
    const [by, bm] = b.split('-').map(Number)
    return ay !== by ? ay - by : am - bm
  })

  let block = ''
  let currentYear = null
  for (const key of sortedKeys) {
    const [year] = key.split('-')
    if (year !== currentYear) {
      if (currentYear) block += '\n'
      block += `  // ${year}\n`
      currentYear = year
    }
    block += `  '${key}': '${starts[key]}',\n`
  }

  const newContent = content.replace(
    /const confirmedStarts = \{[\s\S]*?\n\}/,
    `const confirmedStarts = {\n${block}}`
  )

  writeFileSync(MONTH_STARTS_PATH, newContent)
}

async function main() {
  console.log('=== Updating Shia Hijri month starts ===')
  console.log('Time:', new Date().toISOString())

  const current = readCurrentStarts()
  console.log(`Current confirmed: ${Object.keys(current).length} months`)

  let updated = false

  // Scrape all sources
  const allResults = [
    ...await scrapeImamUs(),
    ...await scrapeSistani(),
  ]

  // Add new confirmed dates (don't overwrite existing ones — first confirmed wins)
  for (const result of allResults) {
    const key = `${result.year}-${result.month}`
    if (!current[key]) {
      console.log(`NEW: ${key} → ${result.gregorianStart} (${result.source})`)
      current[key] = result.gregorianStart
      updated = true
    }
  }

  if (updated) {
    writeUpdatedStarts(current)
    console.log('✓ Updated monthStarts.js')
  } else {
    console.log('No new months to add.')
  }

  console.log('Done.')
}

main().catch(console.error)
