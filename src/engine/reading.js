import readings from '../data/readings.json'

/**
 * Look up pre-composed reading
 * @param {number} hijriDay - 1-30
 * @param {number} signIndex - 0-11
 * @param {number} weekdayIndex - 0=Saturday, 6=Friday
 * @returns {{ ar: string, en: string } | null}
 */
export function getReading(hijriDay, signIndex, weekdayIndex) {
  const key = `${hijriDay}-${signIndex}-${weekdayIndex}`
  return readings[key] || null
}
