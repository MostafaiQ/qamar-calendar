/**
 * Downloads Sistani's مواقيت الأهلة (moon sighting calendar) images
 * for the latest Hijri year. Saves them locally for Claude Code to read.
 *
 * Flow:
 * 1. Fetch sistani.org/arabic/archive/ to find the latest الاهلة page
 * 2. Download all calendar images
 * 3. Output a summary for Claude Code to process
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, '..', '.ahelleh-images')

/**
 * Find the latest الاهلة page URL from the archive
 */
async function findLatestAhellehPage() {
  console.log('Fetching sistani.org archive...')
  const res = await fetch('https://www.sistani.org/arabic/archive/', {
    headers: { 'User-Agent': 'QamarCalendar/1.0' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Archive fetch failed: ${res.status}`)
  const html = await res.text()

  // Find all الاهلة entries with their year
  const entries = []
  const pattern = /مواقيت الأهلة لعام (\d{4})/g
  let match
  while ((match = pattern.exec(html)) !== null) {
    const year = parseInt(match[1])
    const before = html.substring(Math.max(0, match.index - 500), match.index)
    const hrefMatch = [...before.matchAll(/href="(\/arabic\/archive\/(\d+)\/)"/g)].pop()
    if (hrefMatch) {
      entries.push({ year, url: `https://www.sistani.org${hrefMatch[1]}`, id: hrefMatch[2] })
    }
  }

  if (entries.length === 0) throw new Error('No الاهلة pages found')

  entries.sort((a, b) => b.year - a.year)
  console.log(`Found ${entries.length} الاهلة pages. Latest: ${entries[0].year} AH`)
  return entries[0]
}

/**
 * Find image URLs on the الاهلة page
 */
async function findImageUrls(pageUrl) {
  console.log(`Fetching page: ${pageUrl}`)
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': 'QamarCalendar/1.0' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Page fetch failed: ${res.status}`)
  const html = await res.text()

  const imgPattern = /\/images\/ahelleh\d+\/(\d+)\.png/g
  const images = new Set()
  let m
  while ((m = imgPattern.exec(html)) !== null) {
    images.add(m[0])
  }

  return [...images]
    .sort((a, b) => {
      const numA = parseInt(a.match(/\/(\d+)\.png/)[1])
      const numB = parseInt(b.match(/\/(\d+)\.png/)[1])
      return numA - numB
    })
    .map(path => `https://www.sistani.org${path}`)
}

/**
 * Download all images locally
 */
async function downloadImages(urls) {
  if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true })

  let downloaded = 0
  for (const url of urls) {
    const filename = url.split('/').pop()
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'QamarCalendar/1.0' },
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) { console.log(`  Skip ${filename}: HTTP ${res.status}`); continue }
      const buffer = Buffer.from(await res.arrayBuffer())
      writeFileSync(join(IMAGES_DIR, filename), buffer)
      downloaded++
      console.log(`  Downloaded: ${filename} (${buffer.length} bytes)`)
    } catch (e) {
      console.log(`  Failed ${filename}: ${e.message}`)
    }
  }
  return downloaded
}

async function main() {
  console.log('=== Sistani الاهلة Image Downloader ===')

  const latest = await findLatestAhellehPage()
  const imageUrls = await findImageUrls(latest.url)
  console.log(`Found ${imageUrls.length} images for year ${latest.year}`)

  const count = await downloadImages(imageUrls)
  console.log(`\nDownloaded ${count} images to ${IMAGES_DIR}`)

  // Write metadata
  writeFileSync(join(IMAGES_DIR, 'metadata.json'), JSON.stringify({
    hijriYear: latest.year,
    sourceUrl: latest.url,
    fetchedAt: new Date().toISOString(),
    imageCount: count,
  }, null, 2))

  console.log(`\nYear: ${latest.year}`)
  console.log('Images are ready for Claude Code to process.')
}

main().catch(e => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
