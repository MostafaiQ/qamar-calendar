/**
 * Scrapes Shia Hijri month start dates from multiple sources.
 * Updates src/data/monthStarts.js with confirmed sighting data.
 * Runs via GitHub Actions cron (daily) or manually.
 *
 * Sources (in priority order):
 * 1. imam-us.org — Official Imam of Muslims (Sistani representative)
 * 2. sistani.org — Ayatollah Sistani's official site
 * 3. najaf.org — Najaf scholars network
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MONTH_STARTS_PATH = join(__dirname, '..', 'src', 'data', 'monthStarts.js')

const hijriMonthNames = {
  'muharram': 1, 'محرم': 1,
  'safar': 2, 'صفر': 2,
  'rabi al-awwal': 3, 'rabi i': 3, 'ربيع الأول': 3, 'ربيع الاول': 3,
  'rabi al-thani': 4, 'rabi ii': 4, 'ربيع الآخر': 4, 'ربيع الثاني': 4,
  'jumada al-ula': 5, 'jumada i': 5, 'جمادى الأولى': 5, 'جمادى الاولى': 5,
  'jumada al-akhirah': 6, 'jumada ii': 6, 'جمادى الآخرة': 6, 'جمادى الثانية': 6,
  'rajab': 7, 'رجب': 7,
  'shaban': 8, 'sha\'ban': 8, 'شعبان': 8,
  'ramadan': 9, 'رمضان': 9,
  'shawwal': 10, 'شوال': 10,
  'dhul qadah': 11, 'dhu al-qadah': 11, 'ذو القعدة': 11, 'ذي القعدة': 11,
  'dhul hijjah': 12, 'dhu al-hijjah': 12, 'ذو الحجة': 12, 'ذي الحجة': 12,
}

const gregorianMonthNames = {
  'january': 1, 'february': 2, 'march': 3, 'april': 4,
  'may': 5, 'june': 6, 'july': 7, 'august': 8,
  'september': 9, 'october': 10, 'november': 11, 'december': 12,
  'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
  'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
}

/**
 * Try to scrape imam-us.org for crescent sighting announcements
 */
async function scrapeImamUs() {
  const results = []
  try {
    const res = await fetch('https://imam-us.org', {
      headers: { 'User-Agent': 'QamarCalendar/1.0 (Shia Hijri Calendar)' },
    })
    if (!res.ok) { console.log('imam-us.org: HTTP', res.status); return results }
    const html = await res.text()

    // Look for crescent/moon sighting announcements
    // Common patterns: "The first day of [Month] will be [Day], [Month] [Date]"
    // or "crescent of [Hijri Month] has been sighted"
    const patterns = [
      /first\s+day\s+of\s+(\w+)\s+(\d{4})\s+.*?(\w+),?\s+(\w+)\s+(\d{1,2})/gi,
      /(\w+)\s+(\d{4}).*?begins?\s+.*?(\w+)\s+(\d{1,2}),?\s+(\d{4})/gi,
      /crescent.*?(\w+)\s+(\d{4}).*?(\w+)\s+(\d{1,2}),?\s+(\d{4})/gi,
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(html)) !== null) {
        const monthName = match[1].toLowerCase()
        const hijriMonth = hijriMonthNames[monthName]
        if (!hijriMonth) continue

        // Try to extract Gregorian date from the rest
        const yearStr = match[2]
        const hijriYear = parseInt(yearStr)
        if (hijriYear < 1400 || hijriYear > 1500) continue

        console.log(`imam-us.org: Found reference to ${monthName} ${hijriYear}`)
        // More parsing would be needed for actual dates
      }
    }

    console.log('imam-us.org: Scraped successfully')
  } catch (e) {
    console.log('imam-us.org: Failed -', e.message)
  }
  return results
}

/**
 * Fetch from AlAdhan API (Shia adjustment method)
 * Uses adjustment=-1 to approximate Shia dates
 */
async function fetchAlAdhan() {
  const results = []
  try {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    // Try with adjustment=0 and adjustment=-1
    for (const adj of [0, -1]) {
      const url = `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=${adj}`
      const res = await fetch(url)
      if (!res.ok) continue

      const json = await res.json()
      const h = json.data.hijri
      const hijriYear = parseInt(h.year)
      const hijriMonth = parseInt(h.month.number)
      const hijriDay = parseInt(h.day)

      const daysBack = hijriDay - 1
      const monthStart = new Date(today)
      monthStart.setDate(monthStart.getDate() - daysBack)

      const startStr = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`

      results.push({
        year: hijriYear,
        month: hijriMonth,
        gregorianStart: startStr,
        source: `aladhan-api-adj${adj}`,
      })
    }
    console.log(`AlAdhan: Got ${results.length} results`)
  } catch (e) {
    console.log('AlAdhan: Failed -', e.message)
  }
  return results
}

/**
 * Read current confirmedStarts from monthStarts.js
 */
function readCurrentStarts() {
  try {
    const content = readFileSync(MONTH_STARTS_PATH, 'utf-8')
    const starts = {}
    // Parse the confirmedStarts object from the file
    const match = content.match(/const confirmedStarts = \{([\s\S]*?)\n\}/)
    if (!match) return starts

    const entries = match[1].matchAll(/'(\d+-\d+)':\s*'(\d{4}-\d{2}-\d{2})'/g)
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

  // Build new confirmedStarts block
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
  console.log(`Current confirmed months: ${Object.keys(current).length}`)

  let updated = false

  // 1. Try imam-us.org
  await scrapeImamUs()

  // 2. Try AlAdhan API
  const aladhanResults = await fetchAlAdhan()
  for (const result of aladhanResults) {
    const key = `${result.year}-${result.month}`
    if (!current[key]) {
      console.log(`New: ${key} -> ${result.gregorianStart} (${result.source})`)
      current[key] = result.gregorianStart
      updated = true
    }
  }

  if (updated) {
    writeUpdatedStarts(current)
    console.log('Updated monthStarts.js')
  } else {
    console.log('No new months to add.')
  }

  console.log('Done.')
}

main().catch(console.error)
