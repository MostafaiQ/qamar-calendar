let readingsCache = null
let loadingPromise = null

async function loadReadings() {
  if (readingsCache) return readingsCache
  if (!loadingPromise) {
    loadingPromise = import('../data/readings.json').then(m => {
      readingsCache = m.default
      return readingsCache
    })
  }
  return loadingPromise
}

// Eagerly start loading
loadReadings()

/**
 * Look up pre-composed reading (sync, returns null if not yet loaded)
 * @param {number} hijriDay - 1-30
 * @param {number} signIndex - 0-11
 * @param {number} weekdayIndex - 0=Saturday, 6=Friday
 * @returns {{ ar: string, en: string } | null}
 */
export function getReading(hijriDay, signIndex, weekdayIndex) {
  if (!readingsCache) return null
  const key = `${hijriDay}-${signIndex}-${weekdayIndex}`
  return readingsCache[key] || null
}

/**
 * Async version that waits for readings to load
 */
export async function getReadingAsync(hijriDay, signIndex, weekdayIndex) {
  const data = await loadReadings()
  const key = `${hijriDay}-${signIndex}-${weekdayIndex}`
  return data[key] || null
}
